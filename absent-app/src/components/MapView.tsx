import React, { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, Filter, X, MapPin, Calendar, ChevronDown, Bookmark, Share2, CalendarDays, Clock, User, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

// Types
type BaseMarker = {
  id: string;
  position: LatLngExpression;
  popupText: string;
};

type EventMarkerData = BaseMarker & {
  type: 'event';
  imageUrl: string;
  date: string; // or ISO string
  time: {
    start: string;
    end: string;
  };
  hostedBy: string; // derived from organizer_id
  description: string;
  price?: {
    amount: number;
    currency: string;
  };
};

type VenueMarkerData = BaseMarker & {
  type: 'venue';
  imageUrl: string;
  description: string;
  ownedBy: string; // derived from owner_id
  capacity?: number;
  contactEmail?: string;
  contactPhone?: string;
  amenities?: string[]; // optional
};


type MarkerData = EventMarkerData | VenueMarkerData;



type MapConfig = {
  center: LatLngExpression;
  zoom: number;
  scrollWheelZoom: boolean;
  tileLayer: {
    url: string;
    attribution: string;
  };
};

type FilterOption = {
  value: 'event' | 'venue';
  label: string;
  icon: React.ReactNode;
  color: string;
};

// Constants
const DEFAULT_CONFIG: MapConfig = {
  center: [53.2707, -9.0568],
  zoom: 13,
  scrollWheelZoom: true,
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};

const FILTER_OPTIONS: FilterOption[] = [
  {
    value: 'event',
    label: 'Events',
    icon: <Calendar className="w-4 h-4" />,
    color: 'bg-secondary-1' // Add color for each option
  },
  {
    value: 'venue',
    label: 'Venues',
    icon: <MapPin className="w-4 h-4" />,
    color: 'bg--secondary-2'
  }
];

const FilterToggle = ({
  activeFilter,
  setActiveFilter
}: {
  activeFilter: 'event' | 'venue';
  setActiveFilter: (filter: 'event' | 'venue') => void;
}) => {
  return (
    <div className="flex items-center justify-end md:justify-start">
      {/* Desktop Version */}
      <div className="hidden md:flex items-center relative bg-white/90 backdrop-blur-sm rounded-full shadow-sm overflow-hidden border border-gray-200 p-1">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setActiveFilter(option.value)}
            className={`relative z-10 px-4 py-2 flex items-center gap-2 transition-colors ${activeFilter === option.value ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}

        {/* Animated background */}
        <motion.div
          className={`absolute ${activeFilter === 'event' ? 'bg-secondary-1' : 'bg-secondary-2'} rounded-full h-8`}
          initial={false}
          animate={{
            left: activeFilter === 'event' ? '0.25rem' : '50%',
            width: 'calc(50% - 0.5rem)'
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        />
      </div>

      {/* Mobile Version - Improved with layoutId */}
      <div className="md:hidden relative w-[7rem] h-10">
        <div className="absolute inset-0 flex items-center justify-between px-3 text-xs font-medium w-full">
          <span className={`${activeFilter === 'event' ? 'text-blue-600' : 'text-gray-400'}`}>Events</span>
          <span className={`${activeFilter === 'venue' ? 'text-purple-600' : 'text-gray-400'}`}>Venues</span>
        </div>

        <button
          onClick={() => setActiveFilter(activeFilter === 'event' ? 'venue' : 'event')}
          className="w-full h-full rounded-full bg-white border border-gray-200 relative overflow-hidden"
        >
          <motion.div
            layoutId="mobileToggle"
            className={`absolute w-12 h-8 rounded-full top-1 shadow-md flex items-center justify-center ${activeFilter === 'event' ? 'bg-secondary-1' : 'bg-secondary-2'
              }`}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              left: activeFilter === 'event' ? '0.25rem' : 'calc(100% - 3rem - 0.25rem)',
            }}
          >
            <motion.span
              key={activeFilter}
              className="text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {activeFilter === 'event' ? (
                <Calendar className="w-4 h-4" />
              ) : (
                <MapPin className="w-4 h-4" />
              )}
            </motion.span>
          </motion.div>
        </button>
      </div>

    </div>
  );
};

// Custom Components
const FlyToMarker: React.FC<{ position: LatLngExpression }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    console.log("FlyToMarker triggered with position:", position);

    const fly = () => {
      const ZOOM_LEVEL = map.getZoom();
      const targetPoint = map.project(position, ZOOM_LEVEL);
      const OFFSET_Y = 150;
      const adjustedPoint = targetPoint.subtract([0, OFFSET_Y]);
      const newLatLng = map.unproject(adjustedPoint, ZOOM_LEVEL);

      console.log("Flying to:", newLatLng);

      map.flyTo(newLatLng, ZOOM_LEVEL, {
        animate: true,
        duration: 0.5,
        easeLinearity: 0.25,
      });
    };

    // Add a small delay to ensure any popup animations complete
    const timer = setTimeout(fly, 100);
    return () => clearTimeout(timer);
  }, [position, map]);

  return null;
};

const MapControls: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Add custom controls here if needed */}
    </div>
  );
};

const SearchResults: React.FC<{
  results: MarkerData[];
  onSelect: (position: LatLngExpression) => void;
  onClose: () => void;
}> = ({ results, onSelect, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full md:w-[30%]">
      <div className="p-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-gray-700">Search Results</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {results.length === 0 ? (
        <div className="p-4 text-center text-gray-500">No results found</div>
      ) : (
        <ul className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
          {results.map((marker) => (
            <li
              key={marker.id}
              className="p-3 hover:bg-blue-50cursor-pointer transition-colors flex items-center gap-3"
              onClick={() => onSelect(marker.position)}
            >
              <div className="bg-blue-100 p-2 rounded-full">
                {marker.type === 'event' ? (
                  <Calendar className="w-4 h-4 text-primary" />
                ) : (
                  <MapPin className="w-4 h-4 text-primary" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800">{marker.popupText}</p>
                <p className="text-xs text-gray-500 capitalize">{marker.type}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Main Component
const MapView: React.FC<{
  activeFilter: 'event' | 'venue';
  setActiveFilter: (val: 'event' | 'venue') => void;
}> = ({ activeFilter, setActiveFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarker, setSelectedMarker] = useState<LatLngExpression | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Fetch markers from API
  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        // Mock data - replace with real API call
        const mockData: MarkerData[] = [
          {
            id: 'v1',
            type: 'venue',
            position: [53.2707, -9.0568],
            popupText: 'Galway Event Hall',
            imageUrl: 'https://via.placeholder.com/100x100.png?text=Venue',
            description: 'Spacious venue for concerts and art exhibitions.',
            ownedBy: 'VenueHost Co.',
            capacity: 300,
            contactEmail: 'info@venuehost.com',
            contactPhone: '+353-91-555-1234',
            amenities: ['WiFi', 'Parking', 'Stage']
          },
          {
            id: 'v2',
            type: 'venue',
            position: [53.3438, -8.9995],
            popupText: 'NUIG Campus Theatre',
            imageUrl: 'https://via.placeholder.com/100x100.png?text=Venue',
            description: 'Modern auditorium for academic and public events.',
            ownedBy: 'NUIG Admin',
            capacity: 200
          },
          {
            id: 'e1',
            type: 'event',
            position: [53.2816, -9.0601],
            popupText: 'Summer Music Festival',
            imageUrl: 'https://via.placeholder.com/100x100.png?text=Event',
            description: 'Live bands, local food, and good vibes!',
            hostedBy: 'Galway Events Ltd.',
            date: '2025-07-15',
            time: {
              start: '18:00',
              end: '23:00'
            },
            price: {
              amount: 20,
              currency: '€'
            }
          },
          {
            id: 'e2',
            type: 'event',
            position: [53.2906, -9.0651],
            popupText: 'Art Exhibition at The Arch',
            imageUrl: 'https://via.placeholder.com/100x100.png?text=Event',
            description: 'Featuring emerging artists from Galway.',
            hostedBy: 'ArtCircle',
            date: '2025-07-22',
            time: {
              start: '12:00',
              end: '17:00'
            },
            price: {
              amount: 10,
              currency: '€'
            }
          }
        ];


        setMarkers(mockData);
      } catch (error) {
        console.error('Error fetching markers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkers();
  }, []);

  // Filter markers based on search term and active filter
  const filteredMarkers = markers.filter(marker =>
    marker.popupText.toLowerCase().includes(searchTerm.toLowerCase()) &&
    marker.type === activeFilter
  );

  // Format date as dd/mm/yy
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).replace(/\//g, '/');

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-blue-200 rounded-full"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="map-view" className="relative w-full h-screen" style={{ height: 'calc(100vh - 64px)' }}>
      {/* Map Header */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-[90%] max-w-4xl">
        <div className="flex flex-col gap-3">
          {/* Row 1: Search bar */}
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            {/* Search */}
            <div className="flex-1 relative w-full">
              <div className="relative flex items-center bg-white/90 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden">
                {/* Filter Button */}
                <button
                  className="px-3 h-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <Filter className="w-5 h-5" />
                </button>

                {/* Filter Dropdown */}
                {showFilterDropdown && (
                  <div className="absolute z-50 top-full mt-2 bg-white rounded-lg shadow-lg py-1 w-40 md:w-auto right-0 md:left-auto">
                    {FILTER_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={`w-full px-4 py-2 text-left flex items-center gap-2 ${activeFilter === option.value
                          ? 'bg-blue-50 text-primary'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        onClick={() => {
                          setActiveFilter(option.value);
                          setShowFilterDropdown(false);
                        }}
                      >
                        {option.icon}
                        <span className="text-sm">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search locations..."
                  className="flex-1 py-3 px-2 focus:outline-none bg-transparent text-gray-700 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchTerm.trim()) {
                      setShowSearchPanel(true);
                    }
                  }}
                />

                {/* Search Icon */}
                <button
                  className="px-3 h-full flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                  onClick={() => searchTerm.trim() && setShowSearchPanel(true)}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Active Filter Tag */}
              {searchTerm && (
                <div className="absolute left-12 mt-2 flex items-center gap-2">
                  <div className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full shadow">
                    {FILTER_OPTIONS.find(o => o.value === activeFilter)?.label}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </div>
                  <div className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full shadow">
                    {searchTerm}
                    <button
                      className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                      onClick={() => {
                        setSearchTerm('');
                        setShowSearchPanel(false);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Date - now always visible */}
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-3 mt-2 md:mt-0 md:ml-4 self-end">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">{formattedDate}</span>
            </div>
          </div>

          {/* Row 2: Toggle (only) */}
          <div className="flex justify-end md:justify-end">
            <FilterToggle activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          </div>
        </div>
      </div>


      {/* Search Panel - Positioned differently now */}
      {showSearchPanel && (
        <div className="absolute md:top-27 top-40 left-4 z-[1000] md:left-[5%] md:w-[100%] w-[calc(100%-2rem)] mx-auto">
          <SearchResults
            results={filteredMarkers}
            onSelect={(position) => {
              setSelectedMarker(position);
              setShowSearchPanel(false);
            }}
            onClose={() => setShowSearchPanel(false)}
          />
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={DEFAULT_CONFIG.center}
        zoom={DEFAULT_CONFIG.zoom}
        scrollWheelZoom={DEFAULT_CONFIG.scrollWheelZoom}
        className="w-full h-full z-0"
        zoomControl={false}

      >
        <TileLayer
          attribution={DEFAULT_CONFIG.tileLayer.attribution}
          url={DEFAULT_CONFIG.tileLayer.url}
        />

        {markers
          .filter(marker => marker.type === activeFilter)
          .map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              eventHandlers={{
                click: () => {
                  setSelectedMarker(marker.position);
                  console.log("Marker clicked:", marker.position);
                }
              }}
            >
              <Popup className="custom-popup">
                <PopupContent marker={marker} />
              </Popup>
            </Marker>
          ))}

        {selectedMarker && <FlyToMarker position={selectedMarker} />}
        <div className="leaflet-bottom leaflet-right">
          <ZoomControl position="bottomright" />
        </div>
      </MapContainer>

      <MapControls />

      <div className="absolute bottom-0 left-0 w-full z-[1000]">
        <button
          onClick={() => {
            document.getElementById('featured-events')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-full py-6 text-white text-lg font-semibold tracking-wide flex items-center justify-center gap-3 transition-all"
          style={{
            background: 'linear-gradient(to top, var(--color-primary), transparent)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <ChevronDown className="w-6 h-6" />
          Explore
        </button>
      </div>
    </div>
  );
};
const PopupContent: React.FC<{ marker: MarkerData }> = ({ marker }) => {
  // Common action buttons component
  const ActionButtons = ({ onBook }: { onBook?: () => void }) => (
    <div className="flex justify-between items-center mt-3">
      {onBook ? (
        <span className="text-sm font-bold text-primary">
          {marker.type === 'event'
            ? `${marker.price?.currency ?? '€'}${marker.price?.amount ?? '15'}`
            : 'View Details'}
        </span>

      ) : (
        <div />
      )}

      <div className="flex gap-2 items-center">
        <button
          className="p-1.5 rounded-full bg-blue-50 text-primary hover:bg-blue-100 flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(window.location.href);
            // Add toast notification in your app
          }}
        >
          <Share2 className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Share</span>
        </button>
        <button className="p-1.5 rounded-full bg-blue-50 text-primary hover:bg-blue-100 flex items-center gap-1">
          <Bookmark className="w-4 h-4" />
          <span className="text-xs hidden sm:inline">Save</span>
        </button>
        {onBook && (
          <button
            className="px-3 py-1.5 rounded-md bg-primary text-white text-xs font-medium hover:bg-primary-600"
            onClick={onBook}
          >
            {marker.type === 'event' ? 'Book Now' : 'Contact'}
          </button>
        )}
      </div>
    </div>
  );

  if (marker.type === 'event') {
    return (
      <div className="w-64">
        <div className="flex gap-3">
          {/* Event Image */}
          <div className="w-1/3 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={marker.imageUrl || 'https://via.placeholder.com/100x100.png?text=Event'}
              alt={marker.popupText}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Details */}
          <div className="w-2/3">
            <div className="flex items-center gap-1 text-xs text-primary mb-1">
              <CalendarDays className="w-3 h-3" />
              <span>{marker.date || '01/01/25'}</span>
              <Clock className="w-3 h-3 ml-2" />
              <span>{marker.time.start || '18:00'}</span>
            </div>

            <h3 className="font-bold text-gray-800 text-sm line-clamp-2">
              {marker.popupText || 'Sample Event Title'}
            </h3>

            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <User className="w-3 h-3" />
              <span>Hosted by {marker.hostedBy || 'John Doe'}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">123 Event St, Galway</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-2 line-clamp-3">
          {marker.description ||
            'Join us for an unforgettable evening of music, art, and community spirit!'}
        </p>

        <ActionButtons onBook={() => console.log('Booking event')} />
      </div>
    );
  }

  // VENUE CONTENT (now matching event layout)
  if (marker.type === 'venue') {
    return (
      <div className="w-64">
        <div className="flex gap-3">
          {/* Venue Image */}
          <div className="w-1/3 h-24 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={marker.imageUrl || 'https://via.placeholder.com/100x100.png?text=Venue'}
              alt={marker.popupText}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Venue Details */}
          <div className="w-2/3">
            <div className="flex items-center gap-1 text-xs text-primary mb-1">
              <MapPin className="w-3 h-3" />
              <span>Galway, Ireland</span>
            </div>

            <h3 className="font-bold text-gray-800 text-sm line-clamp-2">
              {marker.popupText || 'Venue Name'}
            </h3>

            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <User className="w-3 h-3" />
              <span>Owned by {marker.ownedBy || 'Venue Host'}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              {marker.contactEmail && (
                <a
                  href={`mailto:${marker.contactEmail}`}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Mail className="w-3 h-3" />
                  <span className="line-clamp-1">Email</span>
                </a>
              )}
              {marker.contactPhone && (
                <a
                  href={`tel:${marker.contactPhone}`}
                  className="flex items-center gap-1 ml-2 hover:text-primary"
                >
                  <Phone className="w-3 h-3" />
                  <span className="line-clamp-1">Call</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600 mt-2 line-clamp-3">
          {marker.description || 'A beautiful venue for hosting all kinds of events and gatherings.'}
        </p>

        <ActionButtons onBook={() => console.log('Contacting venue')} />
      </div>
    );
  }

  return <div className="text-sm text-gray-500">Invalid marker type.</div>;
};
export default MapView;