import { useState, useEffect } from 'react';
import { Calendar as LucideCalendar, ChevronDown, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const FeaturedCalendarList = () => {
    const [selectedDate] = useState(new Date()); //need setSelectedDate
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8); // default
    const events = Array(20).fill({
        title: "Music Festival",
        date: "2025-07-10",
        location: "Galway",
        price: "€15",
        imageUrl: "https://via.placeholder.com/300x200?text=Event",
    });

    // Update items per page based on screen size
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setItemsPerPage(4); // 2 cols * 2 rows
            } else if (width < 1024) {
                setItemsPerPage(6); // 3 cols * 2 rows
            } else {
                setItemsPerPage(8); // 4 cols * 2 rows
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const paginatedEvents = events.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const totalPages = Math.ceil(events.length / itemsPerPage);

    return (
        <section id="featured-events" className="py-12 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto pt-5">
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Featured Events</h2>

                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
                    >
                        <span className="font-bold text-lg">{selectedDate.toDateString() === new Date().toDateString() ? "Today" : selectedDate.toLocaleDateString('en-GB')}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showCalendar ? 'rotate-180' : ''}`} />
                    </button>

                    {showCalendar && (
                        <div className="relative z-10">
                            <div className="absolute mt-2 bg-white rounded-lg shadow-xl p-2">
                                {/* Replace with actual calendar component */}
                                <div className="text-sm text-gray-500">Calendar goes here</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Events Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {paginatedEvents.map((event, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                            <img src={event.imageUrl} alt={event.title} className="w-full h-36 object-cover" />
                            <div className="p-3">
                                <h3 className="font-semibold text-base text-black mb-1">{event.title}</h3>
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                    <LucideCalendar className="w-4 h-4 mr-1" />
                                    {event.date}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {event.location}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-primary text-sm">{event.price}</span>
                                    <button className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-2">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-full ${currentPage === page ? 'bg-primary text-white' : 'text-gray-300 hover:text-white hover:bg-gray-300'}`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full text-gray-200 hover:text-white hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCalendarList;
