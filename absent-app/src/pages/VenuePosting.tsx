// pages/host-your-event.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  MapPin, User, Mail, Phone, Image, Check, X, ChevronDown, ChevronUp
} from 'lucide-react';

type VenueFormData = {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  capacity: number;
  amenities: string[];
  pricing: {
    type: string;
    price: number;
    currency: string;
  };
  photos: string[];
};

const amenitiesOptions = [
  'WiFi', 'Parking', 'Wheelchair Access', 'Catering',
  'Projector', 'Sound System', 'Stage', 'Outdoor Space'
];

const pricingTypes = ['hourly', 'daily', 'weekly', 'monthly'];

const VenuePostingPage = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<VenueFormData>();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const onSubmit = (data: VenueFormData) => {
    setIsSubmitting(true);
    const fullVenue = {
      ...data,
      amenities: selectedAmenities,
      photos: photoUrls,
    };
    console.log("Venue submitted (mock):", fullVenue);
    setTimeout(() => {
      alert("Venue submitted successfully!");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const uploadedUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...uploadedUrls]);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 ">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">List Your Venue</h1>
        <p className="text-gray-600">Fill out the form below to showcase your space to potential clients</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('basic')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Basic Information
            </h2>
            {expandedSection === 'basic' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'basic' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name*</label>
                <input 
                  {...register('name', { required: 'Required' })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Enter venue name"
                />
                {errors.name && <p className="mt-1 text-sm text-secondary-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea 
                  {...register('description', { required: 'Required' })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                  rows={4}
                  placeholder="Describe your venue (facilities, atmosphere, etc.)"
                />
                {errors.description && <p className="mt-1 text-sm text-secondary-1">{errors.description.message}</p>}
              </div>
            </div>
          )}
        </section>

        {/* Address */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('address')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Address
            </h2>
            {expandedSection === 'address' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'address' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {['street', 'city', 'state', 'postal_code', 'country'].map((field) => (
                <div key={field} className={field === 'street' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.replace('_', ' ').toUpperCase()}*
                  </label>
                  <input
                    {...register(`address.${field as keyof VenueFormData['address']}`, { required: 'Required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={`Enter ${field.replace('_', ' ')}`}
                  />
                  {errors.address?.[field as keyof VenueFormData['address']] && (
                    <p className="mt-1 text-sm text-secondary-1">
                      {errors.address?.[field as keyof VenueFormData['address']]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Location */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('location')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Location Coordinates
            </h2>
            {expandedSection === 'location' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'location' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Latitude*</label>
                <input 
                  {...register('location.latitude', { required: 'Required' })} 
                  type="number" 
                  step="any" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="e.g. 40.7128"
                />
                {errors.location?.latitude && <p className="mt-1 text-sm text-secondary-1">{errors.location.latitude.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Longitude*</label>
                <input 
                  {...register('location.longitude', { required: 'Required' })} 
                  type="number" 
                  step="any" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="e.g. -74.0060"
                />
                {errors.location?.longitude && <p className="mt-1 text-sm text-secondary-1">{errors.location.longitude.message}</p>}
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">
                  Tip: You can find coordinates using <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Maps</a>
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Capacity & Pricing */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('capacity')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5" /> Capacity & Pricing
            </h2>
            {expandedSection === 'capacity' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'capacity' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity*</label>
                <input 
                  {...register('capacity', { required: 'Required', min: 1 })} 
                  type="number" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                  placeholder="Number of people"
                />
                {errors.capacity && <p className="mt-1 text-sm text-secondary-1">{errors.capacity.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Type*</label>
                <select 
                  {...register('pricing.type', { required: 'Required' })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select pricing type</option>
                  {pricingTypes.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
                {errors.pricing?.type && <p className="mt-1 text-sm text-secondary-1">{errors.pricing.type.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)*</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input 
                    {...register('pricing.price', { required: 'Required', min: 0 })} 
                    type="number" 
                    className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.pricing?.price && <p className="mt-1 text-sm text-secondary-1">{errors.pricing.price.message}</p>}
              </div>
            </div>
          )}
        </section>

        {/* Amenities */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('amenities')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Check className="w-5 h-5" /> Amenities
            </h2>
            {expandedSection === 'amenities' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'amenities' && (
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Select all amenities available at your venue</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenitiesOptions.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => handleAmenityToggle(a)}
                    className={`flex items-center justify-center p-3 rounded-lg transition-all ${
                      selectedAmenities.includes(a) 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Photos */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('photos')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Image className="w-5 h-5" /> Photos
            </h2>
            {expandedSection === 'photos' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'photos' && (
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Upload high-quality photos of your venue (max 10)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {photoUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={url} 
                      alt={`Venue photo ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:opacity-90 transition-opacity"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrls(prev => prev.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {photoUrls.length < 10 && (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload</span>
                    <span className="text-xs text-gray-400 mt-1">JPEG, PNG (max 5MB each)</span>
                  </label>
                )}
              </div>
              {photoUrls.length > 0 && (
                <p className="text-sm text-gray-500">{photoUrls.length}/10 photos uploaded</p>
              )}
            </div>
          )}
        </section>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
          <p className="text-sm text-gray-500">
            * Required fields
          </p>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="px-8 py-3 bg-gradient-to-r from-secondary-1 to-secondary-2 text-white font-medium rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Submit Venue Listing'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VenuePostingPage;