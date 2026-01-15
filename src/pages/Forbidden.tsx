import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="animate-fade-in card-safety max-w-md p-8 shadow-2xl border-destructive/20">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
          </div>
        </div>
        
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Access Denied</h1>
        <p className="mb-6 text-muted-foreground">
          You do not have permission to access the requested resource. If you believe this is an error, please contact your administrator.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button variant="safety" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        Error Code: 403 Forbidden
      </div>
    </div>
  );
};

export default Forbidden;
