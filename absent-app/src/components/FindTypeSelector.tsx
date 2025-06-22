import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FindTypeSelector = ({
  onSelect,
}: {
  onSelect: (filter: 'event' | 'venue') => void;
}) => {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [tempSelection, setTempSelection] = useState<'event' | 'venue' | null>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  const confirmSelection = () => {
    if (tempSelection) {
      onSelect(tempSelection);
    }
  };

  const handleClick = (type: 'event' | 'venue') => {
    setTempSelection(type);
    setShowInstructions(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] backdrop-blur-md bg-white/50 px-6 py-10 flex flex-col items-center justify-center overflow-y-auto text-center">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        What are you looking for?
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleClick('event')}
          className="bg-blue-500 hover:bg-blue-600 text-white text-xl py-5 rounded-xl shadow-md w-full transition-all"
        >
          🎟 Find Event
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => handleClick('venue')}
          className="bg-purple-500 hover:bg-purple-600 text-white text-xl py-5 rounded-xl shadow-md w-full transition-all"
        >
          🏛 Find Venue
        </motion.button>
      </div>

      {showInstructions && tempSelection && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 bg-white/80 border border-gray-200 p-4 rounded-lg max-w-md shadow-sm backdrop-blur-md"
        >
          <p className="text-gray-700 text-sm mb-4">
            {isMobile ? (
              <>👉 Use the toggle below the search bar to switch between Events and Venues.</>
            ) : (
              <>👉 Use the toggle at the <strong>top-right of the map</strong> to switch filters.</>
            )}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={confirmSelection}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600 text-sm font-semibold"
            >
              Got it!
            </button>
            <button
              onClick={confirmSelection}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm font-medium"
            >
              Skip
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FindTypeSelector;
