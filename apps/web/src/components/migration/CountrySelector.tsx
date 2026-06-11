'use client';

import { motion } from 'framer-motion';

interface Country {
  code: string;
  name: string;
  flag: string;
  regulatorCount: number;
}

interface CountrySelectorProps {
  countries: Country[];
  selectedCountry: string | null;
  onSelect: (country: Country) => void;
}

const countryColors: Record<string, string> = {
  USA: '#3B82F6',
  UK: '#8B5CF6',
  Canada: '#10B981',
  Australia: '#F59E0B',
  UAE: '#EF4444',
  Germany: '#EC4899',
  Ireland: '#06B6D4',
  'Saudi Arabia': '#84CC16',
  'New Zealand': '#14B8A6',
  Singapore: '#F97316',
};

export function CountrySelector({ countries, selectedCountry, onSelect }: CountrySelectorProps) {
  return (
    <div>
      <h2 style={{ 
        fontSize: '18px', 
        fontWeight: 700, 
        color: 'white', 
        marginBottom: '16px' 
      }}>
        Select Your Target Country
      </h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '12px' 
      }}>
        {countries.map((country, index) => (
          <motion.button
            key={country.code}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            onClick={() => onSelect(country)}
            style={{
              padding: '16px',
              background: selectedCountry === country.code 
                ? `linear-gradient(135deg, ${countryColors[country.code] || '#6366F1'}20, ${countryColors[country.code] || '#6366F1'}10)`
                : 'rgba(255, 255, 255, 0.03)',
              border: `2px solid ${selectedCountry === country.code ? (countryColors[country.code] || '#6366F1') : 'rgba(255, 255, 255, 0.08)'}`,
              borderRadius: '16px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            whileHover={{ scale: 1.02, borderColor: countryColors[country.code] || '#6366F1' }}
            whileTap={{ scale: 0.98 }}
          >
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              height: '3px', 
              background: countryColors[country.code] || '#6366F1',
              opacity: selectedCountry === country.code ? 1 : 0,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px' }}>{country.flag}</span>
              <span style={{ fontWeight: 600, color: 'white', fontSize: '14px' }}>
                {country.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                {country.regulatorCount} regulator{country.regulatorCount !== 1 ? 's' : ''}
              </p>
              {selectedCountry === country.code && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: countryColors[country.code] || '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                  }}
                >
                  ✓
                </motion.span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default CountrySelector;
