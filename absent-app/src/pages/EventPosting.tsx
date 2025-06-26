import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, Image, Tag, Check, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type EventFormData = {
  title: string;
  description: string;
  venue_id: string;
  venue_custom?: string;
  date: Date;
  isAllDay: boolean;
  time: {
    start: string;
    end: string;
  };
  participants_limit: number;
  ticket_price: {
    amount: number;
    currency: string;
  };
  tags: string[];
  category: string;
  images: string[];
};

const categories = [
  'Music', 'Art', 'Sports', 'Food',
  'Business', 'Technology', 'Education', 'Health'
];

const tagsOptions = [
  'Live Music', 'Exhibition', 'Workshop', 'Conference',
  'Networking', 'Charity', 'Family Friendly', 'Outdoor'
];

// const generateTimeOptions = () => {
//   const options = [];
//   for (let hour = 0; hour < 24; hour++) {
//     for (let minute = 0; minute < 60; minute += 30) {
//       const period = hour >= 12 ? 'PM' : 'AM';
//       const displayHour = hour % 12 === 0 ? 12 : hour % 12;
//       const paddedMinute = minute.toString().padStart(2, '0');
//       options.push({
//         value: `${hour.toString().padStart(2, '0')}:${paddedMinute}`,
//         label: `${displayHour}:${paddedMinute} ${period}`,
//         hour: hour,
//         minute: minute
//       });
//     }
//   }
//   return options;
// };

const EventPostingPage = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<EventFormData>({
    defaultValues: {
      isAllDay: false,
      time: {
        start: '09:00',
        end: '17:00'
      }
    }
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState<{type: 'start' | 'end', visible: boolean}>({type: 'start', visible: false});
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomVenue, setShowCustomVenue] = useState(false);
  const [timeScrollPosition, setTimeScrollPosition] = useState({hour: 9, minute: 0});
  const timePickerRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const isAllDay = watch('isAllDay');

  // Mock venues
  useEffect(() => {
    const mockVenues = [
      { _id: 'v1', name: 'Galway Music Hall', address: { city: 'Galway' } },
      { _id: 'v2', name: 'NUIG Conference Centre', address: { city: 'Galway' } },
      { _id: 'v3', name: 'Salthill Hotel', address: { city: 'Galway' } },
      { _id: 'v4', name: 'Town Hall Theatre', address: { city: 'Galway' } },
      { _id: 'v5', name: 'The Black Box', address: { city: 'Galway' } }
    ];
    setVenues(mockVenues);
    setFilteredVenues(mockVenues);
  }, []);

  // Filter venues based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVenues(venues);
    } else {
      const filtered = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.address.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVenues(filtered);
    }
  }, [searchQuery, venues]);

  // Close time picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target as Node)) {
        setShowTimePicker(prev => ({...prev, visible: false}));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize scroll positions
  useEffect(() => {
    if (showTimePicker.visible && hourRef.current && minuteRef.current) {
      const currentTime = watch(`time.${showTimePicker.type}`);
      const [hours, minutes] = currentTime.split(':');
      const hourNum = parseInt(hours, 10);
      const minuteNum = parseInt(minutes, 10);
      
      // Scroll to current time
      setTimeout(() => {
        if (hourRef.current) {
          hourRef.current.scrollTop = hourNum * 50; // 50px per hour
        }
        if (minuteRef.current) {
          minuteRef.current.scrollTop = (minuteNum / 30) * 50; // 50px per 30 minutes
        }
      }, 50);
    }
  }, [showTimePicker.visible, showTimePicker.type]);

  const onSubmit = (data: EventFormData) => {
    setIsSubmitting(true);
    const eventPayload = {
      ...data,
      tags: selectedTags,
      images: photoUrls,
      created_at: new Date()
    };
    console.log("Event submitted:", eventPayload);
    setTimeout(() => {
      alert("Event created successfully!");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...urls]);
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) setValue('date', date);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleAllDay = () => {
    const newValue = !isAllDay;
    setValue('isAllDay', newValue);
    if (newValue) {
      setValue('time.start', '00:00');
      setValue('time.end', '23:59');
    }
  };

  const formatTimeDisplay = (time: string) => {
    if (time === '00:00') return '12:00 AM';
    if (time === '23:59') return '11:59 PM';
    
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const handleVenueSelect = (venueId: string) => {
    setValue('venue_id', venueId);
    setSearchQuery('');
    setShowCustomVenue(false);
  };

  const handleCustomVenue = () => {
    setValue('venue_id', '');
    setShowCustomVenue(true);
    setSearchQuery('');
  };

  const openTimePicker = (type: 'start' | 'end') => {
    setShowTimePicker({type, visible: true});
  };

  const handleTimeScroll = (type: 'hour' | 'minute', value: number) => {
    setTimeScrollPosition(prev => ({...prev, [type]: value}));
  };

  const confirmTimeSelection = () => {
    const hour = timeScrollPosition.hour.toString().padStart(2, '0');
    const minute = timeScrollPosition.minute === 0 ? '00' : '30';
    setValue(`time.${showTimePicker.type}`, `${hour}:${minute}`);
    setShowTimePicker(prev => ({...prev, visible: false}));
  };

  const renderTimeWheel = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div 
          ref={timePickerRef}
          className="bg-white rounded-xl p-6 w-full max-w-xs"
        >
          <h3 className="text-lg font-medium text-center mb-4">
            Select {showTimePicker.type === 'start' ? 'Start' : 'End'} Time
          </h3>
          
          <div className="flex justify-center items-center mb-6">
            <div className="relative h-40 overflow-hidden w-20 mx-2">
              <div 
                ref={hourRef}
                className="overflow-y-scroll h-full snap-y hide-scrollbar"
                onScroll={(e) => {
                  const scrollTop = e.currentTarget.scrollTop;
                  const hour = Math.round(scrollTop / 50);
                  handleTimeScroll('hour', hour);
                }}
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={`hour-${i}`}
                    className="h-12 flex items-center justify-center snap-start text-lg"
                    style={{ height: '50px' }}
                  >
                    {i.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-12 -translate-y-1/2 border-t border-b border-primary pointer-events-none"></div>
            </div>
            
            <span className="text-xl">:</span>
            
            <div className="relative h-40 overflow-hidden w-20 mx-2">
              <div 
                ref={minuteRef}
                className="overflow-y-scroll h-full snap-y hide-scrollbar"
                onScroll={(e) => {
                  const scrollTop = e.currentTarget.scrollTop;
                  const minute = Math.round(scrollTop / 50) * 30;
                  handleTimeScroll('minute', minute);
                }}
              >
                {['00', '30'].map((minute) => (
                  <div 
                    key={`minute-${minute}`}
                    className="h-12 flex items-center justify-center snap-start text-lg"
                    style={{ height: '50px' }}
                  >
                    {minute}
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 top-1/2 h-12 -translate-y-1/2 border-t border-b border-primary pointer-events-none"></div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setShowTimePicker(prev => ({...prev, visible: false}))}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmTimeSelection}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Create Your Event</h1>
        <p className="text-gray-600">Fill out the details below to organize your perfect event</p>
      </div>

      {showTimePicker.visible && renderTimeWheel()}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

{/* Event Details */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('details')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              Event Details
            </h2>
            {expandedSection === 'details' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'details' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title*</label>
                <input 
                  {...register('title', { required: 'Required' })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your event name"
                />
                {errors.title && <p className="mt-1 text-sm text-secondary-1">{errors.title.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                <textarea 
                  {...register('description', { required: 'Required' })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                  rows={4}
                  placeholder="Tell people about your event"
                />
                {errors.description && <p className="mt-1 text-sm text-secondary-1">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                <select 
                  {...register('category', { required: 'Required' })} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-secondary-1">{errors.category.message}</p>}
              </div>
            </div>
          )}
        </section>

        {/* Date & Time */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('datetime')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Date & Time
            </h2>
            {expandedSection === 'datetime' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'datetime' && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholderText="Select a date"
                />
                {!selectedDate && <p className="mt-1 text-sm text-secondary-1">Required</p>}
              </div>
              
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={isAllDay}
                  onChange={toggleAllDay}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <label htmlFor="allDay" className="ml-2 text-sm font-medium text-gray-700">
                  All-day event
                </label>
              </div>
              
              {!isAllDay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                    <button
                      type="button"
                      onClick={() => openTimePicker('start')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <span>{formatTimeDisplay(watch('time.start'))}</span>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
                    <button
                      type="button"
                      onClick={() => openTimePicker('end')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex justify-between items-center hover:bg-gray-50"
                    >
                      <span>{formatTimeDisplay(watch('time.end'))}</span>
                      <Clock className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Venue */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('venue')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" /> Venue
            </h2>
            {expandedSection === 'venue' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'venue' && (
            <div className="p-6 space-y-4">
              {!showCustomVenue && !watch('venue_id') && (
                <>
                  <div className="relative">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search venues..."
                        className="w-full px-4 py-2 focus:outline-none"
                      />
                      <button type="button" className="px-3 text-gray-500">
                        <Search className="w-5 h-5" />
                      </button>
                    </div>
                    
                    {searchQuery && (
                      <div className="mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredVenues.length > 0 ? (
                          filteredVenues.map(venue => (
                            <button
                              key={venue._id}
                              type="button"
                              onClick={() => handleVenueSelect(venue._id)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">{venue.name}</div>
                              <div className="text-sm text-gray-500">{venue.address.city}</div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm text-gray-500">No venues found</div>
                        )}
                        <button
                          type="button"
                          onClick={handleCustomVenue}
                          className="w-full px-4 py-3 text-left text-primary hover:bg-gray-100 border-t border-gray-200"
                        >
                          + Add custom venue
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!searchQuery && (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-2">Search for a venue or</p>
                      <button
                        type="button"
                        onClick={handleCustomVenue}
                        className="text-primary font-medium hover:underline"
                      >
                        Add a custom venue
                      </button>
                    </div>
                  )}
                </>
              )}
              
              {showCustomVenue && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Venue Name*</label>
                    <input
                      {...register('venue_custom', { required: showCustomVenue ? 'Venue name is required' : false })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter venue name"
                    />
                    {errors.venue_custom && <p className="mt-1 text-sm text-secondary-1">{errors.venue_custom.message}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomVenue(false);
                      setValue('venue_custom', '');
                    }}
                    className="text-sm text-primary hover:underline"
                  >
                    ← Back to venue search
                  </button>
                </div>
              )}
              
              {(watch('venue_id') && !showCustomVenue) && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="font-medium">
                    {venues.find(v => v._id === watch('venue_id'))?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {venues.find(v => v._id === watch('venue_id'))?.address.city}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setValue('venue_id', '');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Change venue
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

{/* Tickets */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('tickets')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <User className="w-5 h-5" /> Tickets & Capacity
            </h2>
            {expandedSection === 'tickets' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'tickets' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input 
                  {...register('participants_limit', { min: { value: 1, message: 'At least 1' } })} 
                  type="number" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Leave empty for unlimited"
                />
                {errors.participants_limit && <p className="mt-1 text-sm text-secondary-1">{errors.participants_limit.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Price (€)*</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">€</span>
                  <input 
                    {...register('ticket_price.amount', { required: 'Required', min: 0 })} 
                    type="number" 
                    className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                {errors.ticket_price?.amount && <p className="mt-1 text-sm text-secondary-1">{errors.ticket_price.amount.message}</p>}
              </div>
            </div>
          )}
        </section>

        {/* Tags */}
        <section className="bg-white rounded-xl shadow-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-6 cursor-pointer bg-gradient-to-r from-primary to-primary-2"
            onClick={() => toggleSection('tags')}
          >
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Tag className="w-5 h-5" /> Tags
            </h2>
            {expandedSection === 'tags' ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
          </div>
          {expandedSection === 'tags' && (
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Select tags that describe your event</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tagsOptions.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`flex items-center justify-start p-3 rounded-lg transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {selectedTags.includes(tag) ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <span className="w-4 h-4 mr-2"></span>
                    )}
                    <span>{tag}</span>
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
              <p className="text-sm text-gray-600 mb-4">Upload high-quality photos of your event (max 10)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {photoUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={url} 
                      alt={`Event photo ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg shadow-sm group-hover:opacity-90 transition-opacity"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrls(prev => prev.filter((_, i) => i !== idx))}
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
                Creating Event...
              </span>
            ) : (
              'Publish Event'
            )}
          </button>
        </div>
      </form>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default EventPostingPage;