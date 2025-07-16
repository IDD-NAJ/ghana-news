
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 border-l-4 border-ghana-red pl-4">
            Terms of Service
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <div className="text-sm text-gray-600 mb-6">
              <p>Last Updated: January 2025</p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using +233News website and services, you accept and agree to be bound 
                by the terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Use License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials on +233News 
                website for personal, non-commercial transitory viewing only. This is the grant of a license, 
                not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">User Content</h2>
              <p className="text-gray-700 leading-relaxed">
                Users may submit comments, feedback, and other content to our website. By submitting content, 
                you grant +233News a non-exclusive, royalty-free, perpetual license to use, modify, and 
                display such content. You are responsible for ensuring that your content does not violate any 
                laws or infringe on the rights of others.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Prohibited Uses</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You may not use our website:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Content Accuracy</h2>
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide accurate and up-to-date information, we make no warranties about 
                the completeness, reliability, and accuracy of this information. Any action you take upon 
                the information on this website is strictly at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Limitations</h2>
              <p className="text-gray-700 leading-relaxed">
                In no event shall +233News or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising out 
                of the use or inability to use the materials on +233News website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Revisions</h2>
              <p className="text-gray-700 leading-relaxed">
                +233News may revise these terms of service for its website at any time without notice. 
                By using this website, you are agreeing to be bound by the then current version of these 
                terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-ghana-red mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@233blognews.com<br />
                  <strong>Address:</strong> Digital Media House, Accra, Ghana
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
