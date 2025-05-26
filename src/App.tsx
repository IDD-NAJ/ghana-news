
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Politics from "./pages/Politics";
import Sports from "./pages/Sports";
import Entertainment from "./pages/Entertainment";
import Business from "./pages/Business";
import Opinion from "./pages/Opinion";
import Lifestyle from "./pages/Lifestyle";
import Technology from "./pages/Technology";
import Story from "./pages/Story";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Advertise from "./pages/Advertise";
import Careers from "./pages/Careers";
import RSSFeed from "./pages/RSSFeed";
import Sitemap from "./pages/Sitemap";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/politics" element={<Politics />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/entertainment" element={<Entertainment />} />
          <Route path="/business" element={<Business />} />
          <Route path="/opinion" element={<Opinion />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/story/:id/:slug?" element={<Story />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/advertise" element={<Advertise />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/rss" element={<RSSFeed />} />
          <Route path="/sitemap" element={<Sitemap />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
