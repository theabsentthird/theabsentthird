import React from 'react';
import MapView from '../components/MapView';
import FeaturedEvents from '../components/FeaturedCalendarList';
import Footer from '../components/Footer';
import NewsletterSignUp from '../components/NewsletterSignUp';

const Home = () => {
  return (
    <main className="w-full h-screen">
      <MapView />
      <FeaturedEvents />
      <NewsletterSignUp />
      <Footer />
    </main>
  );
};

export default Home;
