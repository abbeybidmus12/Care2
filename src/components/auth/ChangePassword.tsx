import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getSession } = useWorkerSession();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = getSession();

    if (!session?.workerId) {
      toast({
        title: "Error",
        description: "Session not found",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      // First verify current password
      const { data: verifyData, error: verifyError } = await supabase
        .from("careworkers")
        .select("id")
        .eq("careworkerid", session.workerId)
        .eq("password", formData.currentPassword)
        .single();

      if (verifyError || !verifyData) {
        toast({
          title: "Error",
          description: "Current password is incorrect",
          variant: "destructive",
        });
        return;
      }

      // Update password
      const { error: updateError } = await supabase
        .from("careworkers")
        .update({ password: formData.newPassword })
        .eq("careworkerid", session.workerId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Password updated successfully",
      });

      navigate("/care-worker-dashboard/settings");
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/95 p-8 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Change Password</h1>
            <p className="text-muted-foreground">
              Enter your current password and choose a new one
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) =>
                  setFormData({ ...formData, currentPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/care-worker-dashboard/settings")}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
