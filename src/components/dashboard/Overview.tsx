import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/hooks/useSession";
import { supabase } from "@/lib/supabase";
import MetricsGrid from "./MetricsGrid";
import QuickActions from "./QuickActions";
import ShiftsList from "./ShiftsList";
import Header from "./Header";

interface OverviewProps {
  metrics?: {
    activeShifts: number;
    availableWorkers: number;
    urgentNeeds: number;
  };
  shifts?: {
    id: string;
    date: string;
    time: string;
    department: string;
    position: string;
    status: "open" | "filled" | "urgent";
  }[];
}

const Overview = () => {
  const { getSession } = useSession();
  const session = getSession();

  const [metrics, setMetrics] = useState({
    activeShifts: 0,
    availableWorkers: 0,
    urgentNeeds: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!session?.careHomeId) return;

      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("care_home_id", session.careHomeId);

      if (data) {
        setMetrics({
          activeShifts: data.filter((s) => s.status === "active").length,
          availableWorkers: 8, // This would come from workers table
          urgentNeeds: data.filter((s) => s.status === "urgent").length,
        });
      }
    };

    fetchMetrics();
  }, [session]);

  const defaultShifts = [
    {
      id: "1",
      date: "2024-03-20",
      time: "09:00 - 17:00",
      department: "Nursing",
      position: "Registered Nurse",
      status: "open",
    },
    {
      id: "2",
      date: "2024-03-21",
      time: "14:00 - 22:00",
      department: "Care Staff",
      position: "Care Assistant",
      status: "filled",
    },
    {
      id: "3",
      date: "2024-03-22",
      time: "22:00 - 06:00",
      department: "Nursing",
      position: "Senior Nurse",
      status: "urgent",
    },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header />
      </div>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Metrics */}
          <div className="col-span-12 lg:col-span-9 space-y-6 w-full overflow-x-auto">
            <MetricsGrid metrics={metrics} />
            <ShiftsList shifts={defaultShifts} />
          </div>

          {/* Right Column - Quick Actions & Recent Activity */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <QuickActions />

            {/* Recent Incidents */}
            <div className="bg-white/95 p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur supports-[backdrop-filter]:bg-white/80">
              <h3 className="text-lg font-semibold mb-4">Recent Incidents</h3>
              <div className="space-y-4">
                {[
                  {
                    type: "urgent",
                    text: "Staff shortage reported in Ward A",
                    time: "30m ago",
                  },
                  {
                    type: "warning",
                    text: "Missed check-in from night shift",
                    time: "2h ago",
                  },
                  {
                    type: "info",
                    text: "New incident report submitted",
                    time: "4h ago",
                  },
                ].map((incident, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-600 border-b pb-3 last:border-0"
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${incident.type === "urgent" ? "bg-red-500" : incident.type === "warning" ? "bg-yellow-500" : "bg-blue-500"}`}
                    ></div>
                    <p>{incident.text}</p>
                    <span className="ml-auto text-xs text-gray-400">
                      {incident.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Worker Availability */}
            <div className="bg-white/95 p-6 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur supports-[backdrop-filter]:bg-white/80">
              <h3 className="text-lg font-semibold mb-4">
                Worker Availability
              </h3>
              <div className="space-y-4">
                {[
                  { shift: "Morning", available: 12, total: 15 },
                  { shift: "Afternoon", available: 8, total: 15 },
                  { shift: "Night", available: 5, total: 10 },
                ].map((data, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{data.shift} Shift</span>
                      <span className="text-muted-foreground">
                        {data.available}/{data.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${data.available < data.total * 0.3 ? "bg-red-500" : data.available < data.total * 0.6 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{
                          width: `${(data.available / data.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
