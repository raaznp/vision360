import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkRole() {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        setIsAdmin(data?.role === "admin");
      } else {
        setIsAdmin(false);
      }
    }
    
    if (!loading) {
      checkRole();
    }
  }, [user, loading]);

  if (loading || isAdmin === null) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
