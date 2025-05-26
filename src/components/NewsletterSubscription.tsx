
import React, { useState } from 'react';
import { Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { useNewsletterSubscription } from '../hooks/useNewsletterSubscription';

const NewsletterSubscription = () => {
  const [email, setEmail] = useState('');
  const { subscribe, loading, error, success, resetState } = useNewsletterSubscription();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    const result = await subscribe(email);
    if (result) {
      setEmail(''); // Clear the input on success
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error || success) {
      resetState();
    }
  };

  return (
    <div className="bg-gradient-to-br from-ghana-red to-ghana-gold rounded-lg shadow-md p-6 text-white">
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 mr-2" />
        <h3 className="text-xl font-playfair font-semibold">Stay Updated</h3>
      </div>
      
      <p className="mb-4 text-sm opacity-90">
        Get the latest Ghana news delivered to your inbox daily.
      </p>

      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-400 rounded-lg flex items-center">
          <CheckCircle className="w-4 h-4 mr-2 text-green-300" />
          <span className="text-sm text-green-100">Successfully subscribed to our newsletter!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-red-300" />
          <span className="text-sm text-red-100">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-white text-ghana-red font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ghana-red mr-2"></div>
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>
    </div>
  );
};

export default NewsletterSubscription;
