import { useState, useEffect } from "react";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import Header from "../dashboard/Header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Bell, Shield } from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

interface SecuritySetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const defaultNotificationSettings: NotificationSetting[] = [
  {
    id: "shift-alerts",
    title: "Shift Alerts",
    description: "Get notified about new available shifts",
    enabled: true,
  },
  {
    id: "timesheet-reminders",
    title: "Timesheet Reminders",
    description: "Receive reminders to submit timesheets",
    enabled: true,
  },
  {
    id: "payslip-notifications",
    title: "Payslip Notifications",
    description: "Get notified when new payslips are available",
    enabled: true,
  },
];

const defaultSecuritySettings: SecuritySetting[] = [
  {
    id: "2fa",
    title: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account",
    enabled: false,
  },
  {
    id: "login-alerts",
    title: "Login Alerts",
    description: "Get notified of new login attempts",
    enabled: true,
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getSession } = useWorkerSession();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    experience: "",
    availability: "",
  });

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      const session = getSession();

      if (session?.workerId) {
        const { data, error } = await supabase
          .from("careworkers")
          .select("*")
          .eq("careworkerid", session.workerId)
          .single();

        if (data && !error) {
          setProfile({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            phone: data.phone || "",
            address: data.address || "",
            role: data.preferred_role || "",
            experience: data.years_experience || "",
            availability: data.availability || "",
          });
        }
      }
    };

    fetchWorkerDetails();
  }, [getSession]);

  const [notificationSettings, setNotificationSettings] = useState(
    defaultNotificationSettings,
  );
  const [securitySettings, setSecuritySettings] = useState(
    defaultSecuritySettings,
  );

  const handleSaveChanges = async () => {
    const session = getSession();
    if (!session?.workerId) {
      toast({
        title: "Error",
        description: "Session not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const updateData: any = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
      };

      if (profile.newPassword) {
        if (profile.newPassword !== profile.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        updateData.password = profile.newPassword;
      }

      const { error } = await supabase
        .from("careworkers")
        .update(updateData)
        .eq("careworkerid", session.workerId);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: profile.newPassword
          ? "Profile and password updated successfully"
          : "Profile updated successfully",
      });

      if (profile.newPassword) {
        setProfile((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleSetting = (
    settingId: string,
    settings: NotificationSetting[] | SecuritySetting[],
    setSettings: Function,
  ) => {
    setSettings(
      settings.map((setting) =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting,
      ),
    );
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Settings" showWorkerName />
      </div>
      <div className="p-6">
        <Tabs defaultValue="profile" className="w-full space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <UserCog className="w-4 h-4 mr-2" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profile Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate("/care-worker-dashboard/change-password")
                    }
                  >
                    Change Password
                  </Button>
                  <Button type="button" onClick={() => handleSaveChanges()}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <Label>{setting.title}</Label>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() =>
                        toggleSetting(
                          setting.id,
                          notificationSettings,
                          setNotificationSettings,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-6">
                {securitySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <Label>{setting.title}</Label>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch
                      checked={setting.enabled}
                      onCheckedChange={() =>
                        toggleSetting(
                          setting.id,
                          securitySettings,
                          setSecuritySettings,
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
