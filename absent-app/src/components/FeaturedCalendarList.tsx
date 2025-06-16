import React, { useState } from 'react';
import { Calendar as LucideCalendar, ChevronDown, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
// If you're using a real calendar component, import it here (like react-calendar or date-picker)

const FeaturedCalendarList = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 10; // Update based on actual data

    // Dummy event data
    const events = Array(6).fill({
        title: "Music Festival",
        date: "2025-07-10",
        location: "Galway",
        price: "€15",
        imageUrl: "https://via.placeholder.com/300x200?text=Event",
    });

    return (
        <section id="featured-events" className="py-12 px-4 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Calendar Header */}
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Featured Events</h2>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow"
                        >
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-36 object-cover"
                            />
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
                                    <span className="font-semibold text-blue-600 text-sm">{event.price}</span>
                                    <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                                        Book
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

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-full ${currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    {totalPages > 5 && (
                        <>
                            <span className="text-gray-500">...</span>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className={`w-10 h-10 rounded-full ${currentPage === totalPages ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                                    }`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCalendarList;
