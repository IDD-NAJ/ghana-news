import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Shield, Eye, CheckCircle, XCircle, Edit } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  verified: boolean;
  full_name: string | null;
  created_at: string;
  active: boolean;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotionEmail, setPromotionEmail] = useState("");
  const [promotionRole, setPromotionRole] = useState("");
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editRole, setEditRole] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch users: " + error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async () => {
    try {
      if (!promotionEmail || !promotionRole) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive"
        });
        return;
      }

      if (promotionRole === 'news_anchor') {
        const { error } = await supabase.rpc('promote_to_news_anchor', {
          user_email: promotionEmail
        });
        if (error) throw error;
      } else if (promotionRole === 'chief_author') {
        const { error } = await supabase.rpc('promote_to_chief_author', {
          user_email: promotionEmail
        });
        if (error) throw error;
      } else {
        toast({
          title: "Error",
          description: "Invalid role selected",
          variant: "destructive"
        });
        return;
      }


      toast({
        title: "Success",
        description: `User promoted to ${promotionRole.replace('_', ' ')} successfully`,
      });

      setPromotionEmail("");
      setPromotionRole("");
      setIsPromoteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive"
      });
    }
  };

  const toggleUserVerification = async (userId: string, currentVerified: boolean) => {
    console.log('toggleUserVerification called:', { userId, currentVerified });
    
    try {
      console.log('Attempting to update verification...');
      const { error } = await supabase
        .from('profiles')
        .update({ verified: !currentVerified })
        .eq('id', userId);

      console.log('Update result:', { error });
      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${!currentVerified ? 'verified' : 'unverified'} successfully`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user verification",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (user: UserProfile) => {
    setEditingUser(user);
    setEditRole(user.role);
    setIsEditDialogOpen(true);
  };

  const updateUserRole = async () => {
    if (!editingUser || !editRole) {
      console.log('Missing data:', { editingUser, editRole });
      return;
    }

    console.log('updateUserRole called:', { 
      editingUserId: editingUser.id, 
      currentRole: editingUser.role, 
      newRole: editRole 
    });

    try {
      console.log('Attempting to update role...');
      
      // Update the role in the profiles table
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          role: editRole,
          verified: editRole === 'customer' ? false : editingUser.verified // Reset verification if demoting to customer
        })
        .eq('id', editingUser.id)
        .select();

      console.log('Role update result:', { data, updateError });
      
      if (updateError) {
        console.error('Supabase update error:', updateError);
        throw updateError;
      }

      console.log('Role update successful:', data);

      toast({
        title: "Success",
        description: `User role updated to ${editRole.replace('_', ' ')} successfully`,
      });

      setIsEditDialogOpen(false);
      setEditingUser(null);
      setEditRole("");
      fetchUsers();
    } catch (error: any) {
      console.error('Role update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'chief_author':
        return 'bg-purple-100 text-purple-800';
      case 'news_anchor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        
        <Dialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Promote User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Promote User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={promotionEmail}
                  onChange={(e) => setPromotionEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={promotionRole} onValueChange={setPromotionRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news_anchor">News Anchor</SelectItem>
                    <SelectItem value="chief_author">Chief Author</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsPromoteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={promoteUser}>
                  Promote User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Role Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>User</Label>
                <p className="text-sm text-muted-foreground">
                  {editingUser?.full_name || editingUser?.email}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select value={editRole} onValueChange={setEditRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="news_anchor">News Anchor</SelectItem>
                    <SelectItem value="chief_author">Chief Author</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingUser(null);
                    setEditRole("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={updateUserRole}>
                  Update Role
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {user.full_name || user.email}
                    </CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role.replace('_', ' ')}
                    </Badge>
                    {user.verified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Role
                    </Button>
                    {/* Show verify button for all users */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserVerification(user.id, user.verified)}
                      className="flex items-center gap-1"
                    >
                      <Shield className="h-4 w-4" />
                      {user.verified ? 'Unverify' : 'Verify'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default UserManagement;