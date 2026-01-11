import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Save } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true);
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, username, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn(error);
        } else if (data) {
          setFormData({
            full_name: data.full_name || "",
            username: data.username || "",
            avatar_url: data.avatar_url || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, [user]);

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        ...formData,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your account settings</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            {loading ? (
               <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <form onSubmit={updateProfile} className="space-y-6">
                
                {/* Avatar Preview */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                    {formData.avatar_url ? (
                      <img src={formData.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl font-semibold text-muted-foreground">
                        {formData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Profile Picture</h3>
                    <p className="text-sm text-muted-foreground">Update your avatar URL below</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        disabled 
                        className="pl-9 bg-muted/50" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="pl-9"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                    />
                     <p className="text-xs text-muted-foreground">
                      Tip: You can use a service like DiceBear or Gravatar.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="safety" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
