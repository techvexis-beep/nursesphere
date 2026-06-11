import { IsString, IsOptional, IsBoolean, IsArray, IsNumber, IsEnum, IsDateString, Min, Max } from 'class-validator';

export class CreateRegulatorDto {
  @IsString()
  name: string;

  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class UpdateRegulatorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  region?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class VerifyRegulatorDto {
  @IsBoolean()
  verified: boolean;
}

export class CreatePathwayDto {
  @IsString()
  country: string;

  @IsString()
  pathwayType: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  eligibility: string[];

  @IsArray()
  @IsString({ each: true })
  steps: string[];

  @IsArray()
  @IsString({ each: true })
  documents: string[];

  @IsArray()
  @IsString({ each: true })
  fees: string[];

  @IsString()
  @IsOptional()
  timeline?: string;

  @IsBoolean()
  @IsOptional()
  examRequired?: boolean;

  @IsString()
  @IsOptional()
  examName?: string;

  @IsBoolean()
  @IsOptional()
  englishRequired?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  englishTests?: string[];
}

export class UpdatePathwayDto {
  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  pathwayType?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  eligibility?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  steps?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  fees?: string[];

  @IsString()
  @IsOptional()
  timeline?: string;

  @IsBoolean()
  @IsOptional()
  examRequired?: boolean;

  @IsString()
  @IsOptional()
  examName?: string;

  @IsBoolean()
  @IsOptional()
  englishRequired?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  englishTests?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdateAnnouncementDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class CreateFAQDto {
  @IsString()
  question: string;

  @IsString()
  answer: string;

  @IsString()
  @IsOptional()
  category?: string;
}

export class UpdateFAQDto {
  @IsString()
  @IsOptional()
  question?: string;

  @IsString()
  @IsOptional()
  answer?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class RegulatorQueryDto {
  @IsString()
  @IsOptional()
  country?: string;

  @IsBoolean()
  @IsOptional()
  verified?: boolean;
}
