import { useState, useEffect } from "react";
import { useUser } from "@/lib/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import Header from "./Header";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, UserCog, Building2, Mail } from "lucide-react";

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
    id: "new-shifts",
    title: "New Shift Alerts",
    description: "Get notified when new shifts are posted",
    enabled: true,
  },
  {
    id: "shift-updates",
    title: "Shift Updates",
    description: "Receive updates about shift changes or cancellations",
    enabled: true,
  },
  {
    id: "worker-reports",
    title: "Worker Reports",
    description: "Get notified about new worker reports or incidents",
    enabled: true,
  },
  {
    id: "timesheet-approvals",
    title: "Timesheet Approvals",
    description: "Notifications for timesheet approval requests",
    enabled: false,
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
  const { user } = useUser();
  const [careHome, setCareHome] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const fetchCareHomeDetails = async () => {
      if (user?.email) {
        const { data, error } = await supabase
          .from("carehomereg")
          .select(
            "care_home_name, business_address, manager_phone, manager_email",
          )
          .eq("manager_email", user.email)
          .single();

        if (data && !error) {
          setCareHome({
            name: data.care_home_name,
            address: data.business_address,
            phone: data.manager_phone,
            email: data.manager_email,
          });
        }
      }
    };

    fetchCareHomeDetails();
  }, [user?.email]);

  const [notificationSettings, setNotificationSettings] = useState(
    defaultNotificationSettings,
  );
  const [securitySettings, setSecuritySettings] = useState(
    defaultSecuritySettings,
  );

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
        <Header title="Settings" />
      </div>
      <div className="p-6">
        <Tabs defaultValue="general" className="w-full space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <Building2 className="w-4 h-4 mr-2" /> General
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="w-4 h-4 mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Care Home Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="careName">Care Home Name</Label>
                    <Input
                      id="careName"
                      value={careHome.name}
                      onChange={(e) =>
                        setCareHome({ ...careHome, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={careHome.email}
                      onChange={(e) =>
                        setCareHome({ ...careHome, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={careHome.phone}
                      onChange={(e) =>
                        setCareHome({ ...careHome, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={careHome.address}
                      onChange={(e) =>
                        setCareHome({ ...careHome, address: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
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
