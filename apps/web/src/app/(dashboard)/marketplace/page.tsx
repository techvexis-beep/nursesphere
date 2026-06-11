'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, MapPin, X, CheckCircle } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  serviceType: string;
  description: string;
  price: number;
  currency: string;
  location: string;
  rating: number;
  reviews: number;
  author: string;
}

const listings: Listing[] = [
  { id: 1, title: 'NCLEX-RN Tutoring', serviceType: 'Tutoring', description: 'Comprehensive NCLEX preparation with 5+ years experience', price: 50, currency: 'USD', location: 'Remote', rating: 4.9, reviews: 127, author: 'Sarah RN' },
  { id: 2, title: 'IV Therapy Training', serviceType: 'Skills', description: 'Hands-on IV cannulation training for new nurses', price: 150, currency: 'USD', location: 'Houston, TX', rating: 4.8, reviews: 89, author: 'Mike RN' },
  { id: 3, title: 'Nursing Essay Editing', serviceType: 'Academic', description: 'Professional editing for nursing essays and papers', price: 30, currency: 'USD', location: 'Remote', rating: 4.7, reviews: 234, author: 'Dr. Emily' },
  { id: 4, title: 'Clinical Skills Bootcamp', serviceType: 'Training', description: 'Weekend bootcamp for essential clinical skills', price: 299, currency: 'USD', location: 'Chicago, IL', rating: 4.9, reviews: 56, author: 'Jennifer RN' },
  { id: 5, title: 'Medication Calculation', serviceType: 'Tutoring', description: 'Master drug dosage calculations for exams', price: 40, currency: 'USD', location: 'Remote', rating: 4.6, reviews: 78, author: 'Alex RN' },
  { id: 6, title: 'Home Health Aide Training', serviceType: 'Training', description: 'Complete training for home health certification', price: 200, currency: 'USD', location: 'Miami, FL', rating: 4.5, reviews: 45, author: 'Maria RN' },
];

const serviceTypes = ['All', 'Tutoring', 'Skills', 'Academic', 'Training', 'Consultation'];

export default function MarketplacePage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [listingsData, setListingsData] = useState(listings);

  const filteredListings = activeFilter === 'All'
    ? listingsData
    : listingsData.filter(l => l.serviceType === activeFilter);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nurse Marketplace</h1>
          <p className="mt-1 text-muted-foreground">Offer or find nursing services, tutoring, and training</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          + Create Listing
        </Button>
      </div>

      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {serviceTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeFilter === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Active Listings</div>
          <div className="text-2xl font-bold text-foreground">{listingsData.length}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Service Providers</div>
          <div className="text-2xl font-bold text-success">{new Set(listingsData.map(l => l.author)).size}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Avg. Rating</div>
          <div className="text-2xl font-bold text-primary">{(listingsData.reduce((a, l) => a + l.rating, 0) / listingsData.length).toFixed(1)}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total Reviews</div>
          <div className="text-2xl font-bold text-foreground">{listingsData.reduce((a, l) => a + l.reviews, 0)}</div>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >
            <div className="border-b border-border p-5">
              <div className="mb-3 flex items-start justify-between">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {listing.serviceType}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="font-medium text-foreground">{listing.rating}</span>
                  <span className="text-xs text-muted-foreground">({listing.reviews})</span>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{listing.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{listing.description}</p>
            </div>
            <div className="flex items-center justify-between bg-muted p-5">
              <div>
                <div className="text-2xl font-bold text-primary">
                  ${listing.price}<span className="text-sm font-normal text-muted-foreground">/session</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {listing.location}
                </div>
              </div>
              <Button variant="default" size="sm">
                Contact
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-card p-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Create New Listing</h2>
              <Button onClick={() => setShowCreateForm(false)} variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <CreateListingForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

function CreateListingForm({ onClose }: { onClose: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    serviceType: '',
    description: '',
    price: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  if (success) {
    return (
      <div className="py-8 text-center">
        <CheckCircle className="mx-auto mb-2 h-12 w-12 text-success" />
        <p className="font-semibold text-success">Listing created successfully!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
        <Input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="e.g., NCLEX Tutoring" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Service Type</label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={formData.serviceType}
          onChange={e => setFormData({...formData, serviceType: e.target.value})}
          required
        >
          <option value="">Select type</option>
          {serviceTypes.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-foreground">Description</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          required
          rows={3}
          placeholder="Describe your service..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Price (USD)</label>
          <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required placeholder="50" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-foreground">Location</label>
          <Input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required placeholder="City or Remote" />
        </div>
      </div>
      <Button type="submit" disabled={submitting} className="mt-2">
        {submitting ? 'Creating...' : 'Create Listing'}
      </Button>
    </form>
  );
}
