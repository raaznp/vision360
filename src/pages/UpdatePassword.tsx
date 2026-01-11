import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/logo.jpg";
import { useToast } from "@/hooks/use-toast";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");

  // Clean hash from URL on mount if present (Supabase adds type=recovery code)
  useEffect(() => {
    // Ideally, we check if the user is authenticated (which they should be if they clicked the magic link)
    // or if the session was established.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
         // If no session, they might have lost the token or accessed directly
         // Potentially redirect to login or stay here but update might fail
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Password updated successfully",
          description: "You can now log in with your new password.",
        });
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Vision 360° Logo" className="h-14 w-auto object-contain" />
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">Vision 360°</h1>
            <p className="text-sm text-primary-foreground/70">Safety Training System</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-card rounded-2xl shadow-elevated p-8 border border-border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Set New Password</h2>
              <p className="text-muted-foreground mt-2">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="safety"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
