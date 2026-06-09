/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { useDeviceType } from './hooks/useDeviceType';
import { cn } from './lib/utils';
import { AnimatePresence, motion } from 'motion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import MobileHeader from './components/MobileHeader';

// Lazy loaded routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const CreateRequest = React.lazy(() => import('./pages/CreateRequest'));
const RequestDetails = React.lazy(() => import('./pages/RequestDetails'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const ChatList = React.lazy(() => import('./pages/ChatList'));
const ChatRoom = React.lazy(() => import('./pages/ChatRoom'));
const MyQuotes = React.lazy(() => import('./pages/MyQuotes'));
const RequestsList = React.lazy(() => import('./pages/RequestsList'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const CompareQuotes = React.lazy(() => import('./pages/CompareQuotes'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const LeaveReview = React.lazy(() => import('./pages/LeaveReview'));
const SearchArtisans = React.lazy(() => import('./pages/SearchArtisans'));
const MissionPage = React.lazy(() => import('./pages/MissionPage'));
const HowItWorksPage = React.lazy(() => import('./pages/HowItWorksPage'));
const MyRequests = React.lazy(() => import('./pages/MyRequests'));
const SubmitQuote = React.lazy(() => import('./pages/SubmitQuote'));
const MyProjects = React.lazy(() => import('./pages/MyProjects'));
const MyReviews = React.lazy(() => import('./pages/MyReviews'));
const Stats = React.lazy(() => import('./pages/Stats'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminRequests = React.lazy(() => import('./pages/admin/AdminRequests'));
const AdminStats = React.lazy(() => import('./pages/admin/AdminStats'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const ArtisanOnboarding = React.lazy(() => import('./pages/ArtisanOnboarding'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});


function PrivateRoute({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth();
 if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
 return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
 const { user, loading } = useAuth();
 if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
 
 if (!user) return <Navigate to="/admin/login" />;
 if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
 
 return <>{children}</>;
}

function AppContent() {
 const { isMobile } = useDeviceType();
 const location = useLocation();

 React.useEffect(() => {
   window.scrollTo(0, 0);
 }, [location.pathname]);

 return (
 <div className={cn(
   "min-h-screen bg-editorial-bg flex flex-col pt-safe pb-safe",
   isMobile ? "pb-24" : ""
 )}>
 {isMobile ? <MobileHeader /> : <Navbar />}
 <main className="flex-grow flex flex-col w-full">
 <AnimatePresence mode="wait">
 <motion.div
   key={location.pathname}
   initial={{ opacity: 0, y: 15 }}
   animate={{ opacity: 1, y: 0 }}
   exit={{ opacity: 0, y: -15 }}
   transition={{ duration: 0.25, ease: 'easeOut' }}
   className="flex-grow flex flex-col w-full"
 >
 <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><div className="w-10 h-10 border-4 border-secondary/30 border-t-editorial-accent rounded-full animate-spin" /></div>}>
 <Routes location={location}>
 <Route path="/" element={<LandingPage />} />
 <Route path="/login" element={<LoginPage />} />
 <Route path="/signup" element={<SignupPage />} />
 <Route path="/forgot-password" element={<ForgotPassword />} />
 <Route path="/terms" element={<Terms />} />
 <Route path="/privacy" element={<Privacy />} />
 
 <Route path="/onboarding" element={
 <PrivateRoute>
 <ArtisanOnboarding />
 </PrivateRoute>
 } />

 <Route path="/dashboard" element={
 <PrivateRoute>
 <Dashboard />
 </PrivateRoute>
 } />
 
 <Route path="/requests/new" element={
 <PrivateRoute>
 <CreateRequest />
 </PrivateRoute>
 } />
 
 <Route path="/requests/:id" element={<RequestDetails />} />

 <Route path="/requests" element={<RequestsList />} />
 <Route path="/mission" element={<MissionPage />} />
 <Route path="/how-it-works" element={<HowItWorksPage />} />

 <Route path="/notifications" element={
 <PrivateRoute>
 <Notifications />
 </PrivateRoute>
 } />

 <Route path="/my-quotes" element={
 <PrivateRoute>
 <MyQuotes />
 </PrivateRoute>
 } />

 <Route path="/profile" element={
 <PrivateRoute>
 <ProfilePage />
 </PrivateRoute>
 } />

 <Route path="/artisan/:id" element={<PublicProfile />} />

 <Route path="/chats" element={
 <PrivateRoute>
 <ChatList />
 </PrivateRoute>
 } />

 <Route path="/chats/:id" element={
 <PrivateRoute>
 <ChatRoom />
 </PrivateRoute>
 } />

 <Route path="/search" element={<SearchArtisans />} />
 
 <Route path="/my-requests" element={
 <PrivateRoute>
 <MyRequests />
 </PrivateRoute>
 } />

 <Route path="/requests/:id/quotes" element={
 <PrivateRoute>
 <CompareQuotes />
 </PrivateRoute>
 } />

 <Route path="/projects/:id" element={
 <PrivateRoute>
 <ProjectDetails />
 </PrivateRoute>
 } />

 <Route path="/projects/:id/review" element={
 <PrivateRoute>
 <LeaveReview />
 </PrivateRoute>
 } />

 <Route path="/requests/:id/quote" element={
 <PrivateRoute>
 <SubmitQuote />
 </PrivateRoute>
 } />

 <Route path="/my-projects" element={
 <PrivateRoute>
 <MyProjects />
 </PrivateRoute>
 } />

 <Route path="/my-reviews" element={
 <PrivateRoute>
 <MyReviews />
 </PrivateRoute>
 } />

 <Route path="/stats" element={
 <PrivateRoute>
 <Stats />
 </PrivateRoute>
 } />
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={
  <AdminRoute>
  <AdminDashboard />
  </AdminRoute>
  } />

 <Route path="/admin/users" element={
 <AdminRoute>
 <AdminUsers />
 </AdminRoute>
 } />

 <Route path="/admin/requests" element={
 <AdminRoute>
 <AdminRequests />
 </AdminRoute>
 } />

 <Route path="/admin/stats" element={
 <AdminRoute>
 <AdminStats />
 </AdminRoute>
 } />

  <Route path="*" element={<NotFound />} />
  </Routes>
  </Suspense>
  </motion.div>
 </AnimatePresence>
 </main>
 {isMobile && <MobileNav />}
 </div>
 );
}

export default function App() {
 const { isMobile } = useDeviceType();

 const content = (
  <QueryClientProvider client={queryClient}>
  <AuthProvider>
  <ToastProvider>
  <BrowserRouter>
  <AppContent />
  </BrowserRouter>
  </ToastProvider>
  </AuthProvider>
  </QueryClientProvider>
 );

 return isMobile ? content : <ReactLenis root>{content}</ReactLenis>;
}
