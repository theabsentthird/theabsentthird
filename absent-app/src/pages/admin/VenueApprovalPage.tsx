import { useState, useEffect } from 'react';
import { Check, X, Clock, MapPin, User, Mail } from 'lucide-react';

type Venue = {
  _id: string;
  name: string;
  description: string;
  address: {
    city: string;
    country: string;
  };
  owner: {
    name: string;
    email: string;
  };
  capacity: number;
  moderation_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

const VenueApprovalPage = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    setIsLoading(true);

    // Mock venue data
    const mockVenues: Venue[] = [
      {
        _id: '1',
        name: 'Galway Music Hall',
        description: 'Spacious venue for concerts and festivals.',
        address: { city: 'Galway', country: 'Ireland' },
        owner: { name: 'Alice Smith', email: 'alice@example.com' },
        capacity: 300,
        moderation_status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'NUIG Conference Centre',
        description: 'Perfect for talks and workshops.',
        address: { city: 'Galway', country: 'Ireland' },
        owner: { name: 'Bob Johnson', email: 'bob@example.com' },
        capacity: 150,
        moderation_status: 'approved',
        created_at: new Date().toISOString()
      }
    ];

    setTimeout(() => {
      setVenues(filter === 'pending' ? mockVenues.filter(v => v.moderation_status === 'pending') : mockVenues);
      setIsLoading(false);
    }, 600);
  }, [filter]);

  const handleApprove = (venueId: string) => {
    setVenues(prev =>
      prev.map(v => (v._id === venueId ? { ...v, moderation_status: 'approved' } : v))
    );
  };

  const handleReject = (venueId: string) => {
    setVenues(prev =>
      prev.map(v => (v._id === venueId ? { ...v, moderation_status: 'rejected' } : v))
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Venue Approvals</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All Venues
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : venues.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Clock className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-1">
            {filter === 'pending' ? 'No pending venues to review' : 'No venues found'}
          </h3>
          <p className="text-gray-500">
            {filter === 'pending'
              ? 'All venues have been moderated.'
              : 'Try creating a venue to see it here.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-50 p-4 font-medium text-gray-700">
            <div className="col-span-4">Venue</div>
            <div className="col-span-2">Location</div>
            <div className="col-span-2">Owner</div>
            <div className="col-span-2">Capacity</div>
            <div className="col-span-2">Status</div>
          </div>

          {venues.map((venue) => (
            <div key={venue._id} className="grid grid-cols-12 p-4 border-b border-gray-100 hover:bg-gray-50">
              <div className="col-span-4">
                <h3 className="font-medium">{venue.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{venue.description}</p>
              </div>

              <div className="col-span-2 flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{venue.address.city}, {venue.address.country}</span>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-1 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{venue.owner.name}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  <span>{venue.owner.email}</span>
                </div>
              </div>

              <div className="col-span-2 flex items-center">
                <span className="text-sm">{venue.capacity} people</span>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                {venue.moderation_status === 'pending' ? (
                  <>
                    <button
                      onClick={() => handleApprove(venue._id)}
                      className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleReject(venue._id)}
                      className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    venue.moderation_status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {venue.moderation_status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueApprovalPage;
