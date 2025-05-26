
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useAdvertisingInquiry } from '../hooks/useAdvertisingInquiry';
import { useToast } from '../hooks/use-toast';

const AdvertisingInquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    package_type: '',
    budget_range: '',
    message: ''
  });

  const { submitInquiry, loading, error, success, resetState } = useAdvertisingInquiry();
  const { toast } = useToast();

  const packageOptions = [
    { value: 'banner', label: 'Banner Ads' },
    { value: 'sponsored', label: 'Sponsored Content' },
    { value: 'newsletter', label: 'Newsletter Sponsorship' },
    { value: 'custom', label: 'Custom Package' }
  ];

  const budgetOptions = [
    { value: 'under-1000', label: 'Under GHS 1,000' },
    { value: '1000-5000', label: 'GHS 1,000 - 5,000' },
    { value: '5000-10000', label: 'GHS 5,000 - 10,000' },
    { value: 'over-10000', label: 'Over GHS 10,000' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error || success) {
      resetState();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.company || !formData.package_type || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    const submitted = await submitInquiry(formData);
    
    if (submitted) {
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you for your interest. Our advertising team will contact you soon.",
      });
      
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        package_type: '',
        budget_range: '',
        message: ''
      });
    } else {
      toast({
        title: "Submission Failed",
        description: error || "Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-2xl font-semibold text-ghana-red mb-6">Get a Custom Quote</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full"
              placeholder="your.email@company.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <Input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              required
              className="w-full"
              placeholder="Your company name"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="package_type" className="block text-sm font-medium text-gray-700 mb-2">
              Package Interest *
            </label>
            <select
              id="package_type"
              name="package_type"
              value={formData.package_type}
              onChange={handleInputChange}
              required
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select a package</option>
              {packageOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <select
              id="budget_range"
              name="budget_range"
              value={formData.budget_range}
              onChange={handleInputChange}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select budget range</option>
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full"
            placeholder="Tell us about your advertising goals and requirements..."
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-ghana-red hover:bg-red-700 text-white px-8 py-3"
        >
          {loading ? 'Submitting...' : 'Submit Inquiry'}
        </Button>
      </form>
    </div>
  );
};

export default AdvertisingInquiryForm;
