import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/lib/hooks/useSession";

export default function CareHomeSignIn() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setSession } = useSession();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("carehomes")
        .select("id, manager_email, carehomeid, password, care_home_name")
        .eq("manager_email", formData.email)
        .eq("password", formData.password)
        .single();

      if (error) throw error;

      if (data) {
        // Store session data
        setSession({
          careHomeId: data.carehomeid,
          email: data.manager_email,
          name: data.care_home_name,
        });

        toast({
          title: "Sign in successful",
        });
        navigate("/care-home-dashboard");
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: "Sign in failed",
        description: "There was an error signing in. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/95 p-8 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Care Home Sign In</h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Sign In
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => navigate("/care-home-register")}
            >
              Register here
            </Button>
          </p>
        </form>
      </Card>
    </div>
  );
}
