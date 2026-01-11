import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { logActivity } from "@/lib/logger";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@supabase/supabase-js";

// Initialize a temporary client for creating users (avoids logging out the admin)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  
  // Add User State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "", role: "user" });
  const [isCreating, setIsCreating] = useState(false);

  // Edit State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false }); // Changed from created_at to updated_at in case created_at doesn't exist
    
    if (error) {
      console.error(error);
      toast({ 
        variant: "destructive", 
        title: "Error fetching users", 
        description: error.message // Show the actual error message
      });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.fullName) {
      toast({ variant: "destructive", title: "Please fill in all fields" });
      return;
    }

    try {
      setIsCreating(true);

      // TRICK: Use a separate client that doesn't persist the session to create the new user
      // This prevents the Admin from being logged out!
      const tempClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });

      const { data: authData, error: authError } = await tempClient.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: {
            full_name: newUser.fullName,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Now update the profile with the correct role using our Admin (Main) client
        // We might need to wait a moment for the trigger to create the profile, or upsert it ourselves
        
        // Wait 1s for trigger (if any) or just upsert
        await new Promise(r => setTimeout(r, 1000));

        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role: newUser.role, full_name: newUser.fullName })
          .eq("id", authData.user.id);

        if (profileError) {
          // If update fails (maybe profile didn't exist yet), try insert
          await supabase.from("profiles").upsert({
            id: authData.user.id,
            full_name: newUser.fullName,
            role: newUser.role,
            email: newUser.email // if email is in profiles schema
          });
        }

        logActivity("Create User", `Created user ${newUser.fullName} (${newUser.role})`);
        
        toast({ title: "User created successfully!" });
        setIsAddOpen(false);
        setNewUser({ fullName: "", email: "", password: "", role: "user" });
        fetchUsers();
      }

    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: error.message || "Failed to create user" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", editingUser.id);

    if (error) {
       toast({ variant: "destructive", title: "Update failed" });
    } else {
       toast({ title: "User updated successfully" });
       logActivity("Update Role", `Updated ${editingUser.full_name || editingUser.email} to ${newRole}`);
       setEditingUser(null);
       fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) return;

    // Note: We can only delete the profile. Auth user persists but loses access.
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      toast({ variant: "destructive", title: "Delete failed" });
    } else {
      toast({ title: "User deleted" });
      logActivity("Delete User", `Deleted profile of ${userName}`);
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    u.id.includes(search)
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
               <DialogHeader>
                 <DialogTitle>Add New User</DialogTitle>
               </DialogHeader>
               <div className="space-y-4 pt-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Full Name</label>
                   <Input 
                     value={newUser.fullName} 
                     onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} 
                     placeholder="John Doe"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Email</label>
                   <Input 
                     type="email"
                     value={newUser.email} 
                     onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                     placeholder="john@example.com"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Password</label>
                   <Input 
                     type="password"
                     value={newUser.password} 
                     onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                     placeholder="••••••••"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium">Role</label>
                   <Select value={newUser.role} onValueChange={(val) => setNewUser({...newUser, role: val})}>
                     <SelectTrigger>
                       <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="user">User</SelectItem>
                       <SelectItem value="staff">Staff</SelectItem>
                       <SelectItem value="admin">Admin</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <DialogFooter>
                 <Button onClick={handleCreateUser} disabled={isCreating}>
                   {isCreating ? "Creating..." : "Create User"}
                 </Button>
               </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search users..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name || "Unknown"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {u.role || 'user'}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(u.updated_at || Date.now()).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => {
                              setEditingUser(u);
                              setNewRole(u.role || "user");
                            }}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select value={newRole} onValueChange={setNewRole}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleUpdateRole} className="w-full">
                                Update Role
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive/90"
                          disabled={currentUser?.id === u.id}
                          onClick={() => handleDeleteUser(u.id, u.full_name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
