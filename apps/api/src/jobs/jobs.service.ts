import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto, ApplyJobDto, ExternalJobQueryDto } from './dto/jobs.dto';
import { ConfigService } from '@nestjs/config';

interface ExternalJob {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    id?: number;
  };
  location: string;
  remote?: boolean;
  salary?: string;
  job_type?: string;
  description?: string;
  url: string;
  published_at?: string;
  experience_level?: string;
  skills?: string[];
  category?: string;
}

interface JobDataAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExternalJob[];
}

@Injectable()
export class JobsService {
  private jobDataCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 15 * 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createJob(employerId: string, dto: CreateJobDto) {
    return this.prisma.job.create({
      data: {
        employerId,
        ...dto,
      },
      include: {
        employer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async updateJob(jobId: string, employerId: string, dto: UpdateJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.employerId !== employerId) {
      throw new ForbiddenException('You can only update your own jobs');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: dto,
      include: {
        employer: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteJob(jobId: string, employerId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.employerId !== employerId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }

    return this.prisma.job.delete({ where: { id: jobId } });
  }

  async getJobs(query: JobQueryDto) {
    const { page = 1, limit = 20, search, country, department, jobType, experienceLevel, isRemote, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { requirements: { contains: search } },
      ];
    }

    if (country) where.country = country;
    if (department) where.department = department;
    if (jobType) where.jobType = jobType;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (isRemote !== undefined) where.isRemote = isRemote;

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          employer: {
            select: {
              companyName: true,
              industry: true,
              logo: true,
              isVerified: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getJobById(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        employer: {
          select: {
            companyName: true,
            industry: true,
            companySize: true,
            description: true,
            logo: true,
            website: true,
            isVerified: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: { viewCount: { increment: 1 } },
    });

    return job;
  }

  async applyForJob(jobId: string, candidateId: string, dto: ApplyJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const existingApplication = await this.prisma.jobApplication.findFirst({
      where: { jobId, candidateId },
    });

    if (existingApplication) {
      throw new ForbiddenException('You have already applied for this job');
    }

    const [application] = await Promise.all([
      this.prisma.jobApplication.create({
        data: {
          jobId,
          candidateId,
          coverLetter: dto.coverLetter,
        },
        include: {
          job: { select: { title: true, employer: { select: { companyName: true } } } },
          candidate: { select: { firstName: true, lastName: true, email: true } },
        },
      }),
      this.prisma.job.update({
        where: { id: jobId },
        data: { applicationCount: { increment: 1 } },
      }),
    ]);

    return application;
  }

  async getEmployerJobs(employerId: string) {
    return this.prisma.job.findMany({
      where: { employerId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });
  }

  async getJobApplications(jobId: string, employerId: string) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    if (job.employerId !== employerId) {
      throw new ForbiddenException('Not authorized to view applications');
    }

    return this.prisma.jobApplication.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            isVerified: true,
          },
        },
      },
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    employerId: string,
    status: string,
    notes?: string,
  ) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.job.employerId !== employerId) {
      throw new ForbiddenException('Not authorized');
    }

    return this.prisma.jobApplication.update({
      where: { id: applicationId },
      data: {
        status,
        notes,
        reviewedAt: new Date(),
      },
    });
  }

  async getCandidateApplications(candidateId: string) {
    return this.prisma.jobApplication.findMany({
      where: { candidateId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            country: true,
            city: true,
            isRemote: true,
            employer: { select: { companyName: true, logo: true } },
          },
        },
      },
    });
  }

  async getJobStats(employerId: string) {
    const jobs = await this.prisma.job.findMany({
      where: { employerId },
      select: {
        id: true,
        title: true,
        viewCount: true,
        applicationCount: true,
        isActive: true,
        createdAt: true,
      },
    });

    const totalViews = jobs.reduce((sum, job) => sum + job.viewCount, 0);
    const totalApplications = jobs.reduce((sum, job) => sum + job.applicationCount, 0);
    const activeJobs = jobs.filter(job => job.isActive).length;

    return {
      totalJobs: jobs.length,
      activeJobs,
      totalViews,
      totalApplications,
      jobs,
    };
  }

  private getCachedData(key: string): any | null {
    const cached = this.jobDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.jobDataCache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.jobDataCache.set(key, { data, timestamp: Date.now() });
  }

  private buildSearchTitles(location?: string): string[] {
    const nursingTitles = [
      'nurse',
      'registered nurse',
      'rn',
      'nursing',
      'licensed practical nurse',
      'lpn',
      'certified nursing assistant',
      'cna',
      'nurse practitioner',
      'np',
      'clinical nurse',
      'icu nurse',
      'er nurse',
      'emergency nurse',
      'operating room nurse',
      'surgical nurse',
      'pediatric nurse',
      'neonatal nurse',
      'labor and delivery nurse',
      'psychiatric nurse',
      'mental health nurse',
      'oncology nurse',
      'dialysis nurse',
      'home health nurse',
      'travel nurse',
      'nurse educator',
      'nurse manager',
      'nurse administrator',
      'public health nurse',
      'community health nurse',
    ];
    
    if (location) {
      return nursingTitles.map(title => `${title} ${location}`);
    }
    return nursingTitles;
  }

  async fetchExternalJobs(query: ExternalJobQueryDto, userLocation?: string) {
    const apiKey = this.config.get('JOBDATA_API_KEY');
    const apiUrl = this.config.get('JOBDATA_API_URL');
    
    if (!apiKey || !apiUrl) {
      return this.getDemoJobs(query, userLocation);
    }

    const page = query.page || 1;
    const limit = query.limit || 25;
    
    let searchTitle = query.title || 'nurse';
    let searchLocation = query.location || '';
    
    if (!query.location && userLocation) {
      searchLocation = userLocation;
    }

    const cacheKey = `external_jobs_${searchTitle}_${searchLocation}_${page}_${limit}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const titles = this.buildSearchTitles(searchLocation);
    const titleToSearch = titles[(page - 1) % titles.length];

    try {
      const params = new URLSearchParams();
      params.set('title', titleToSearch);
      if (searchLocation) {
        params.set('location', searchLocation);
      }
      params.set('page', page.toString());
      params.set('limit', limit.toString());

      if (query.jobType) {
        params.set('job_type', query.jobType);
      }
      if (query.remote) {
        params.set('remote', 'true');
      }
      if (query.company) {
        params.set('company', query.company);
      }

      const response = await fetch(`${apiUrl}/jobs/?${params.toString()}`, {
        headers: {
          'Authorization': `Api-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new HttpException('Failed to fetch jobs from external API', HttpStatus.BAD_GATEWAY);
      }

      const data: JobDataAPIResponse = await response.json();
      
      const normalizedJobs = this.normalizeJobs(data.results, searchLocation);
      
      const result = {
        jobs: normalizedJobs,
        pagination: {
          page,
          limit,
          total: data.count || normalizedJobs.length * 10,
          totalPages: Math.ceil((data.count || 1000) / limit),
          hasMore: !!data.next,
        },
        location: searchLocation || 'Global',
        source: 'jobdataapi',
      };

      this.setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching external jobs:', error);
      return this.getDemoJobs(query, userLocation);
    }
  }

  async fetchExternalJobById(jobId: string) {
    const apiKey = this.config.get('JOBDATA_API_KEY');
    const apiUrl = this.config.get('JOBDATA_API_URL');
    
    if (!apiKey || !apiUrl) {
      const demoJobs = this.getAllDemoJobs();
      return demoJobs.find(j => j.id === jobId) || demoJobs[0];
    }

    const cacheKey = `external_job_${jobId}`;
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await fetch(`${apiUrl}/jobs/${jobId}/`, {
        headers: {
          'Authorization': `Api-Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new HttpException('Job not found', HttpStatus.NOT_FOUND);
      }

      const data: ExternalJob = await response.json();
      const normalizedJob = this.normalizeSingleJob(data);
      
      this.setCachedData(cacheKey, normalizedJob);
      return normalizedJob;
    } catch (error) {
      console.error('Error fetching external job:', error);
      const demoJobs = this.getAllDemoJobs();
      return demoJobs.find(j => j.id === jobId) || demoJobs[0];
    }
  }

  async fetchJobsByLocation(userCountry?: string, userCity?: string) {
    const location = userCity || userCountry;
    
    const [localJobs, nationalJobs, globalJobs] = await Promise.all([
      this.fetchExternalJobs({ page: 1, limit: 10 }, location || ''),
      this.fetchExternalJobs({ page: 1, limit: 10 }, userCountry || 'usa'),
      this.fetchExternalJobs({ page: 1, limit: 10 }, ''),
    ]);

    return {
      local: localJobs.jobs.slice(0, 5),
      national: nationalJobs.jobs.slice(0, 5),
      global: globalJobs.jobs.slice(0, 10),
      recommendedLocation: location || 'your area',
    };
  }

  private normalizeJobs(jobs: ExternalJob[], preferredLocation?: string): any[] {
    return jobs.map(job => this.normalizeSingleJob(job, preferredLocation));
  }

  private normalizeSingleJob(job: ExternalJob, preferredLocation?: string): any {
    const salary = this.extractSalary(job.salary);
    
    return {
      id: `ext_${job.id}`,
      externalId: job.id,
      title: job.title,
      company: {
        name: job.company?.name || 'Healthcare Facility',
        logo: job.company?.logo || null,
      },
      location: job.location || 'Not specified',
      isRemote: job.remote || false,
      salary: salary,
      salaryMin: salary?.min,
      salaryMax: salary?.max,
      jobType: this.mapJobType(job.job_type),
      description: job.description,
      requirements: job.skills?.join(', ') || '',
      url: job.url,
      publishedAt: job.published_at || new Date().toISOString(),
      experienceLevel: job.experience_level || 'Not specified',
      category: job.category || 'Healthcare',
      source: 'external',
    };
  }

  private extractSalary(salaryStr?: string): { min: number; max: number; display: string } | null {
    if (!salaryStr) return null;
    
    const numbers = salaryStr.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const min = parseInt(numbers[0]) * 1000;
      const max = parseInt(numbers[numbers.length - 1]) * 1000;
      return {
        min,
        max,
        display: salaryStr,
      };
    }
    return null;
  }

  private mapJobType(jobType?: string): string {
    if (!jobType) return 'Full-time';
    
    const typeMap: Record<string, string> = {
      'full_time': 'Full-time',
      'part_time': 'Part-time',
      'contract': 'Contract',
      'temporary': 'Temporary',
      'internship': 'Internship',
      'volunteer': 'Volunteer',
    };
    
    return typeMap[jobType.toLowerCase()] || jobType;
  }

  private getDemoJobs(query: ExternalJobQueryDto, userLocation?: string): any {
    const allJobs = this.getAllDemoJobs();
    const location = query.location || userLocation || '';
    
    let filtered = allJobs;
    if (location) {
      const loc = location.toLowerCase();
      filtered = allJobs.filter(j => 
        j.location.toLowerCase().includes(loc) || 
        j.isRemote
      );
      if (filtered.length < 5) {
        filtered = [...filtered, ...allJobs.filter(j => !j.location.toLowerCase().includes(loc) && !j.isRemote)].slice(0, 25);
      }
    }

    const page = query.page || 1;
    const limit = query.limit || 25;
    const start = (page - 1) * limit;
    
    return {
      jobs: filtered.slice(start, start + limit),
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasMore: start + limit < filtered.length,
      },
      location: location || 'Global',
      source: 'demo',
    };
  }

  private getAllDemoJobs() {
    const locations = [
      'New York, NY, USA',
      'Los Angeles, CA, USA',
      'Chicago, IL, USA',
      'Houston, TX, USA',
      'Phoenix, AZ, USA',
      'Philadelphia, PA, USA',
      'San Antonio, TX, USA',
      'San Diego, CA, USA',
      'Dallas, TX, USA',
      'San Jose, CA, USA',
      'London, UK',
      'Manchester, UK',
      'Birmingham, UK',
      'Leeds, UK',
      'Glasgow, UK',
      'Toronto, Canada',
      'Vancouver, Canada',
      'Montreal, Canada',
      'Sydney, Australia',
      'Melbourne, Australia',
      'Dubai, UAE',
      'Singapore',
      'Berlin, Germany',
      'Paris, France',
      'Amsterdam, Netherlands',
    ];

    const companies = [
      { name: 'Mayo Clinic', logo: null },
      { name: 'Cleveland Clinic', logo: null },
      { name: 'Johns Hopkins Hospital', logo: null },
      { name: 'UCLA Health', logo: null },
      { name: 'Cedars-Sinai', logo: null },
      { name: 'Mass General Hospital', logo: null },
      { name: 'Duke University Hospital', logo: null },
      { name: 'Northwestern Memorial', logo: null },
      { name: 'UCSF Medical Center', logo: null },
      { name: 'NewYork-Presbyterian', logo: null },
      { name: 'NHS England', logo: null },
      { name: 'Bupa', logo: null },
      { name: 'Nuffield Health', logo: null },
      { name: 'Health Canada', logo: null },
      { name: 'Australia Health Service', logo: null },
    ];

    const jobTitles = [
      { title: 'Registered Nurse (RN)', exp: 'Entry Level' },
      { title: 'Registered Nurse - ICU', exp: 'Mid Level' },
      { title: 'Emergency Room Nurse', exp: 'Mid Level' },
      { title: 'Operating Room Nurse', exp: 'Mid Level' },
      { title: 'Pediatric Nurse', exp: 'Entry Level' },
      { title: 'Neonatal ICU Nurse', exp: 'Advanced' },
      { title: 'Labor and Delivery Nurse', exp: 'Mid Level' },
      { title: 'Psychiatric Nurse', exp: 'Mid Level' },
      { title: 'Oncology Nurse', exp: 'Advanced' },
      { title: 'Dialysis Nurse', exp: 'Mid Level' },
      { title: 'Home Health Nurse', exp: 'Entry Level' },
      { title: 'Travel Nurse', exp: 'Mid Level' },
      { title: 'Nurse Practitioner', exp: 'Advanced' },
      { title: 'Clinical Nurse Specialist', exp: 'Advanced' },
      { title: 'Certified Registered Nurse Anesthetist', exp: 'Advanced' },
      { title: 'Licensed Practical Nurse (LPN)', exp: 'Entry Level' },
      { title: 'Certified Nursing Assistant (CNA)', exp: 'Entry Level' },
      { title: 'Nursing Director', exp: 'Senior' },
      { title: 'Nurse Educator', exp: 'Senior' },
      { title: 'Public Health Nurse', exp: 'Mid Level' },
    ];

    const jobs: any[] = [];
    for (let i = 0; i < 100; i++) {
      const jobTitle = jobTitles[i % jobTitles.length];
      const company = companies[i % companies.length];
      const location = locations[i % locations.length];
      const isRemote = i % 7 === 0;
      
      const salaryMin = 50000 + Math.floor(Math.random() * 80000);
      const salaryMax = salaryMin + 30000 + Math.floor(Math.random() * 40000);

      jobs.push({
        id: `demo_${i + 1}`,
        externalId: `${i + 1}`,
        title: jobTitle.title,
        company,
        location: isRemote ? 'Remote' : location,
        isRemote,
        salary: {
          min: salaryMin,
          max: salaryMax,
          display: `$${(salaryMin / 1000).toFixed(0)}K - $${(salaryMax / 1000).toFixed(0)}K`,
        },
        salaryMin,
        salaryMax,
        jobType: ['Full-time', 'Part-time', 'Contract', 'Per Diem'][i % 4],
        description: `We are seeking a dedicated ${jobTitle.title} to join our healthcare team. The ideal candidate will provide exceptional patient care and work collaboratively with our medical staff.`,
        requirements: 'BSN preferred, current RN license, BLS/ACLS certification, excellent communication skills',
        url: 'https://example.com/apply',
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        experienceLevel: jobTitle.exp,
        category: 'Healthcare',
        source: 'demo',
      });
    }

    return jobs;
  }
}
