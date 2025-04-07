
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PremiumVersion from "./pages/PremiumVersion";
import NewsletterArchive from "./pages/NewsletterArchive";
import ArticleView from "./pages/ArticleView";
import NotFound from "./pages/NotFound";
import InsertNewsletter from "./pages/InsertNewsletter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/premium-version" element={<PremiumVersion />} />
          <Route path="/newsletters" element={<NewsletterArchive />} />
          <Route path="/newsletters/:slug" element={<ArticleView />} />
          <Route path="/admin/insert-newsletter" element={<InsertNewsletter />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
