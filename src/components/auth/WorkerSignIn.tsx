import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";

export default function WorkerSignIn() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setSession } = useWorkerSession();
  const [formData, setFormData] = useState({
    email: "",
    verifyid: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from("careworkers")
        .select("id, email, careworkerid, password, first_name, last_name")
        .eq("email", formData.email)
        .eq("password", formData.verifyid)
        .single();

      if (error) throw error;

      if (data) {
        setSession({
          workerId: data.careworkerid,
          email: data.email,
          name: `${data.first_name} ${data.last_name}`,
        });
        toast({
          title: "Sign in successful",
          description: "Welcome back!",
        });
        navigate("/care-worker-dashboard");
      } else {
        toast({
          title: "Sign in failed",
          description: "Invalid email or verification ID",
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
            <h1 className="text-3xl font-bold">Care Worker Sign In</h1>
            <p className="text-muted-foreground">
              Enter your email and Password
            </p>
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
                value={formData.verifyid}
                onChange={(e) =>
                  setFormData({ ...formData, verifyid: e.target.value })
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
              onClick={() => navigate("/register")}
            >
              Register here
            </Button>
          </p>
        </form>
      </Card>
    </div>
  );
}
