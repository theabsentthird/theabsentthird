import { useState } from 'react';

const NewsletterSignUp = () => {
  const [email, setEmail] = useState('');

  return (
    <section className="py-12 px-4 bg-secondary-3">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay Updated</h2>
        <p className="text-gray-600 mb-6">Subscribe to our newsletter for the latest events and offers</p>

        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-3 rounded-lg bg-white text-content-dark border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="px-6 py-3 bg-primary bg-secondary-1 hover:bg-secondary-2 text-white rounded-lg hover:bg-primary-2 transition-colors font-medium">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignUp;
