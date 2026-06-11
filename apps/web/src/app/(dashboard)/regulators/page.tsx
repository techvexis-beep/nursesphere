'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Search, Wifi, Landmark, Loader2, Check } from 'lucide-react';

interface Regulator {
  id: string;
  name: string;
  slug: string;
  country: string;
  region: string | null;
  logo: string | null;
  website: string | null;
  description: string | null;
  isVerified: boolean;
  _count: {
    announcements: number;
    pathways: number;
    faqs: number;
  };
}

const countries = [
  { code: 'ALL', name: 'All Countries', flag: '\u{1F30D}' },
  { code: 'USA', name: 'United States', flag: '\u{1F1FA}\u{1F1F8}' },
  { code: 'UK', name: 'United Kingdom', flag: '\u{1F1EC}\u{1F1E7}' },
  { code: 'Canada', name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}' },
  { code: 'Australia', name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}' },
  { code: 'Ireland', name: 'Ireland', flag: '\u{1F1EE}\u{1F1EA}' },
  { code: 'UAE', name: 'UAE', flag: '\u{1F1E6}\u{1F1EA}' },
  { code: 'Saudi Arabia', name: 'Saudi Arabia', flag: '\u{1F1F8}\u{1F1E6}' },
  { code: 'Germany', name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}' },
  { code: 'Singapore', name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
];

const mockRegulators: Regulator[] = [
  {
    id: '1',
    name: 'Nursing & Midwifery Council (NMC)',
    slug: 'nmc-uk',
    country: 'UK',
    region: 'United Kingdom',
    logo: null,
    website: 'https://www.nmc.org.uk',
    description: 'The Nursing and Midwifery Council regulates nurses and midwives in the UK, ensuring high standards of care and professional development.',
    isVerified: true,
    _count: { announcements: 24, pathways: 5, faqs: 18 },
  },
  {
    id: '2',
    name: 'National Council of State Boards of Nursing (NCSBN)',
    slug: 'ncsbn-usa',
    country: 'USA',
    region: 'United States',
    logo: null,
    website: 'https://www.ncsbn.org',
    description: 'NCSBN provides leadership to advance regulatory excellence for nursing practice, protecting public health.',
    isVerified: true,
    _count: { announcements: 36, pathways: 4, faqs: 25 },
  },
  {
    id: '3',
    name: 'Australian Health Practitioner Regulation Agency (AHPRA)',
    slug: 'ahpra-australia',
    country: 'Australia',
    region: 'Australia',
    logo: null,
    website: 'https://www.ahpra.gov.au',
    description: 'AHPRA supports the National Boards to regulate health practitioners in Australia.',
    isVerified: true,
    _count: { announcements: 18, pathways: 6, faqs: 15 },
  },
  {
    id: '4',
    name: 'Nursing Council of Kenya (NCK)',
    slug: 'nck-kenya',
    country: 'Kenya',
    region: 'Kenya',
    logo: null,
    website: 'https://www.nckenya.com',
    description: 'The Nursing Council of Kenya regulates nursing education and practice in Kenya.',
    isVerified: true,
    _count: { announcements: 12, pathways: 3, faqs: 8 },
  },
  {
    id: '5',
    name: 'Saudi Commission for Health Specialties (SCFHS)',
    slug: 'scfhs-saudi',
    country: 'Saudi Arabia',
    region: 'Saudi Arabia',
    logo: null,
    website: 'https://www.scfhs.org',
    description: 'SCFHS regulates health practitioners and facilities in the Kingdom of Saudi Arabia.',
    isVerified: true,
    _count: { announcements: 28, pathways: 4, faqs: 20 },
  },
  {
    id: '6',
    name: 'Dubai Health Authority (DHA)',
    slug: 'dha-uae',
    country: 'UAE',
    region: 'UAE',
    logo: null,
    website: 'https://www.dha.gov.ae',
    description: 'DHA oversees healthcare services and licensing in Dubai, UAE.',
    isVerified: true,
    _count: { announcements: 15, pathways: 3, faqs: 12 },
  },
];

export default function RegulatorsPage() {
  const [regulators, setRegulators] = useState<Regulator[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiError, setApiError] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchRegulators = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedCountry === 'ALL'
        ? '/api/regulators'
        : `/api/regulators?country=${selectedCountry}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRegulators(data);
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      setApiError(true);
      const filtered = selectedCountry === 'ALL'
        ? mockRegulators
        : mockRegulators.filter(r => r.country === selectedCountry);
      setRegulators(filtered);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry]);

  useEffect(() => {
    fetchRegulators();
  }, [fetchRegulators]);

  const filteredRegulators = regulators.filter(regulator =>
    regulator.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="header-padding bg-gradient-to-b from-primary/10 to-transparent text-center px-4 sm:px-8 pt-[100px] pb-[60px] max-sm:pt-20 max-sm:pb-10 max-sm:px-4">
        {apiError && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-[13px] mb-5">
            <Wifi className="h-3.5 w-3.5" />
            Demo Mode - Showing sample regulators
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary/10 border border-primary/20 rounded-full text-indigo-300 font-semibold mb-6 text-sm">
            <Landmark className="h-4 w-4" />
            Global Nursing Regulators
          </span>
          <h1 className="text-4xl sm:text-5xl max-sm:text-[28px] font-bold mb-4">
            Official Nursing <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Regulators</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto max-sm:text-sm">
            Access official licensing information, exam requirements, and announcements from nursing regulatory bodies worldwide
          </p>
        </motion.div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search regulators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-auto py-3.5 bg-card border-border rounded-xl text-[15px]"
          />
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {countries.map((country) => (
            <Button
              key={country.code}
              onClick={() => setSelectedCountry(country.code)}
              variant={selectedCountry === country.code ? 'secondary' : 'ghost'}
              className={cn(
                "transition-all duration-300 hover:-translate-y-0.5",
                selectedCountry === country.code
                  ? "bg-primary/20 border-primary text-indigo-300"
                  : "bg-card border-border text-muted-foreground",
                "border rounded-xl",
                isMobile ? "px-3 py-2 text-xs" : "px-[18px] py-2.5 text-sm"
              )}
            >
              <span>{country.flag}</span>
              <span>{isMobile ? country.code : country.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-[60px]">
            <Loader2 className="h-6 w-6 mx-auto mb-4 animate-spin text-muted-foreground" />
            <div className="text-muted-foreground">Loading regulators...</div>
          </div>
        ) : filteredRegulators.length === 0 ? (
          <div className="text-center py-[60px]">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl mb-2">No regulators found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: isMobile ? '1fr' : (isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(380px, 1fr))') }}>
            {filteredRegulators.map((regulator, index) => (
              <motion.div
                key={regulator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/regulators/${regulator.slug}`} className="no-underline">
                  <div className="bg-card border border-border backdrop-blur-xl rounded-2xl p-5 sm:p-7 cursor-pointer flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/30">
                    <div className="flex items-start gap-3.5 mb-3.5">
                      <div className="w-[52px] h-[52px] sm:w-16 sm:h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {regulator.logo ? (
                          <Image src={regulator.logo} alt={regulator.name} width={40} height={40} className="object-contain" />
                        ) : (
                          <Landmark className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-[15px] sm:text-lg font-semibold text-foreground m-0">{regulator.name}</h3>
                          {regulator.isVerified && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-500 text-[10px] font-semibold">
                              <Check className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm max-sm:text-xs">
                          <span>{countries.find(c => c.code === regulator.country)?.flag || '\u{1F30D}'}</span>
                          <span>{regulator.region || regulator.country}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm max-sm:text-[13px] leading-relaxed mb-4 flex-1">
                      {regulator.description?.slice(0, 100)}...
                    </p>

                    <div className="flex gap-3 sm:gap-4 pt-3.5 border-t border-border">
                      <div className="text-center flex-1">
                        <div className="text-base sm:text-xl font-bold text-primary">{regulator._count.pathways}</div>
                        <div className="text-[11px] text-muted-foreground">Pathways</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-base sm:text-xl font-bold text-pink-500">{regulator._count.announcements}</div>
                        <div className="text-[11px] text-muted-foreground">Updates</div>
                      </div>
                      <div className="text-center flex-1">
                        <div className="text-base sm:text-xl font-bold text-emerald-500">{regulator._count.faqs}</div>
                        <div className="text-[11px] text-muted-foreground">FAQs</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
