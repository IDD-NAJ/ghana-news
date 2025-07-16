import React from 'react';
import NewsletterSubscription from '../components/NewsletterSubscription';
import { Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Newsletter: React.FC = () => {
  return (
    <>
      <Header />
      <section id="newsletter" className="relative min-h-[70vh] flex flex-col items-center justify-center py-20 bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden">
        {/* Decorative background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-xl w-full text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-2">
              <Mail size={36} />
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-playfair mb-4 text-blue-800 dark:text-blue-200">Subscribe to Our Newsletter</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Get the latest news, analysis, and exclusive stories delivered straight to your inbox. Stay informed with +233News.
          </p>
          {/* Testimonial/Quote */}
          <blockquote className="italic text-base text-muted-foreground mb-6 border-l-4 border-primary pl-4">
            “The +233News newsletter keeps me ahead of the curve every week!”
          </blockquote>
          {/* Feature List */}
          <ul className="flex flex-col sm:flex-row justify-center gap-4 mb-8 text-sm text-foreground/80">
            <li className="flex items-center gap-2"><span className="text-primary">•</span> Weekly updates</li>
            <li className="flex items-center gap-2"><span className="text-primary">•</span> Exclusive insights</li>
            <li className="flex items-center gap-2"><span className="text-primary">•</span> No spam, ever</li>
          </ul>
          {/* Subscription Card */}
          <div className="bg-white/90 dark:bg-background/80 rounded-xl shadow-lg border border-border p-8">
            <NewsletterSubscription />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Newsletter; 