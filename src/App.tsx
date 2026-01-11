import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseContent from "./pages/CourseContent";
import Quiz from "./pages/Quiz";
import Feedback from "./pages/Feedback";
import Profile from "./pages/Profile";
import Certificates from "./pages/Certificates";
import AdminLayout from "./pages/admin/AdminLayout";
import UserManagement from "./pages/admin/UserManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
        <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
           <div className="flex flex-col items-center gap-4 text-center">
             <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
               <svg
                 xmlns="http://www.w3.org/2000/svg"
                 width="24"
                 height="24"
                 viewBox="0 0 24 24"
                 fill="none"
                 stroke="currentColor"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 className="h-8 w-8 text-red-600 dark:text-red-400"
               >
                 <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                 <line x1="12" y1="9" x2="12" y2="13" />
                 <line x1="12" y1="17" x2="12.01" y2="17" />
               </svg>
             </div>
             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuration Required</h1>
             <p className="text-gray-500 dark:text-gray-400">
               The application could not connect to the backend because the environment variables are missing.
             </p>
           </div>
           
           <div className="space-y-4">
             <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900/50">
               <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Step 1: Create configuration file</p>
               <p className="text-sm text-gray-500 dark:text-gray-400">
                 Rename <code>.env.example</code> to <code>.env</code> in the project root.
               </p>
             </div>
             
             <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900/50">
               <p className="mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">Step 2: Add credentials</p>
               <pre className="overflow-x-auto rounded bg-gray-950 p-3 text-xs text-gray-50">
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key</pre>
             </div>
           </div>

           <div className="text-center text-sm text-gray-500 dark:text-gray-400">
             After saving the file, restart the server with <code>npm run dev</code>
           </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              } />
              <Route path="/courses/:courseId" element={
                <ProtectedRoute>
                  <CourseDetail />
                </ProtectedRoute>
              } />
              <Route path="/courses/:courseId/content" element={
                <ProtectedRoute>
                  <CourseContent />
                </ProtectedRoute>
              } />
              <Route path="/courses/:courseId/quiz" element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } />
              <Route path="/feedback" element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/certificates" element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="users" element={<UserManagement />} />
                <Route path="logs" element={<ActivityLogs />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
