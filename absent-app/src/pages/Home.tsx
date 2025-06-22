import React, { useState, useEffect } from 'react';
import MapView from '../components/MapView';
import FeaturedEvents from '../components/FeaturedCalendarList';
import Footer from '../components/Footer';
import NewsletterSignUp from '../components/NewsletterSignUp';
import FindTypeSelector from '../components/FindTypeSelector';
import ScrollToTopButton from '../components/ScrollToTopButton';

const Home = () => {
  const [hasSelectedType, setHasSelectedType] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'event' | 'venue'>('event');

  useEffect(() => {
    const savedType = localStorage.getItem('selectedType') as 'event' | 'venue' | null;
    if (savedType) {
      setActiveFilter(savedType);
      setHasSelectedType(true);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleSelect = (type: 'event' | 'venue') => {
    setActiveFilter(type);
    setHasSelectedType(true);
    localStorage.setItem('selectedType', type);
    window.scrollTo(0, 0);
  };

  return (
    <main className={`relative w-full ${!hasSelectedType ? 'overflow-hidden h-screen' : ''}`}>
      <MapView activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      {!hasSelectedType && (
        <div className="absolute inset-0 z-[1000]">
          <FindTypeSelector onSelect={handleSelect} />
        </div>
      )}
      <FeaturedEvents />
      <NewsletterSignUp />
      <ScrollToTopButton />
      <Footer />
    </main>
  );
};

export default Home;
