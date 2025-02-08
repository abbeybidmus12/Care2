import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/50 to-slate-100/50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white/95 p-8 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="relative">
              <HeartPulse className="h-10 w-10 text-blue-500 animate-pulse" />
              <div className="absolute inset-0 h-10 w-10 bg-blue-500 blur-lg opacity-50 animate-pulse"></div>
            </div>
            <h1 className="text-4xl font-bold">CareBook App</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Care Workers</h2>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => navigate("/worker-signin")}
                >
                  Sign In as Care Worker
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  Register as Care Worker
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Care Homes</h2>
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => navigate("/care-home-signin")}
                >
                  Sign In as Care Home
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/care-home-register")}
                >
                  Register Care Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
