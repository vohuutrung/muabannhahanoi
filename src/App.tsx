import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { FavoritesProvider } from "@/hooks/useFavorites";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Listing from "./pages/Listing";
import PropertyDetail from "./pages/PropertyDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import PostPropertyPage from "./pages/PostPropertyPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/nha-dat-ban" element={<Listing />} />
                <Route path="/nha-dat-ban/:id" element={<PropertyDetail />} />
                <Route path="/tin-tuc" element={<News />} />
                <Route path="/tin-tuc/:id" element={<NewsDetail />} />
                <Route path="/lien-he" element={<Contact />} />
                <Route path="/yeu-thich" element={<Favorites />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/post-property" 
                  element={
                    <ProtectedRoute>
                      <PostPropertyPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
