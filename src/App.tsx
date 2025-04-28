
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PremiumVersion from "./pages/PremiumVersion";
import NewsletterArchive from "./pages/NewsletterArchive";
import ArticleView from "./pages/ArticleView";
import NotFound from "./pages/NotFound";
import InsertNewsletter from "./pages/InsertNewsletter";
import Account from "./pages/Account";
import AccountPreferences from "./pages/AccountPreferences";
import AccountBookmarks from "./pages/AccountBookmarks";

const queryClient = new QueryClient();

const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <>
                  <Navigation />
                  <Index />
                </>
              }
            />
            <Route 
              path="/premium-version" 
              element={
                <>
                  <Navigation />
                  <PremiumVersion />
                </>
              }
            />
            <Route 
              path="/newsletters" 
              element={
                <>
                  <Navigation />
                  <NewsletterArchive />
                </>
              }
            />
            <Route 
              path="/newsletters/:slug" 
              element={
                <>
                  <Navigation />
                  <ArticleView />
                </>
              }
            />
            <Route 
              path="/admin/insert-newsletter" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Navigation />
                  <InsertNewsletter />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Navigation />
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/account/preferences" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Navigation />
                  <AccountPreferences />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/account/bookmarks" 
              element={
                <ProtectedRoute requireAuth={true}>
                  <Navigation />
                  <AccountBookmarks />
                </ProtectedRoute>
              }
            />
            <Route 
              path="*" 
              element={
                <>
                  <Navigation />
                  <NotFound />
                </>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => <AppWithProviders />;

export default App;
