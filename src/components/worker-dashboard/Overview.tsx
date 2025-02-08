import React, { useState, useEffect } from "react";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import { supabase } from "@/lib/supabase";
import Header from "../dashboard/Header";
import { Card } from "@/components/ui/card";
import { Calendar, Briefcase, Clock, Star, BanknoteIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
}

const MetricCard = ({ title, value, icon, description }: MetricCardProps) => (
  <Card className="p-6 hover:shadow-md transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="p-3 bg-primary/10 rounded-full">{icon}</div>
    </div>
  </Card>
);

const calculateDaysUntil = (date: string) => {
  const today = new Date();
  const shiftDate = new Date(date);
  const diffTime = shiftDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function WorkerOverview() {
  const { getSession } = useWorkerSession();
  const [approvedShifts, setApprovedShifts] = useState<
    Array<{
      id: string;
      date: string;
      time: string;
      location: string;
      role: string;
    }>
  >([]);

  useEffect(() => {
    const fetchApprovedShifts = async () => {
      const session = getSession();
      if (!session?.workerId) return;

      const { data, error } = await supabase
        .from("shifts")
        .select("*, carehomes(care_home_name)")
        .eq("worker_id", session.workerId)
        .eq("status", "approved")
        .order("date", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error fetching approved shifts:", error);
        return;
      }

      if (data) {
        const formattedShifts = data.map((shift) => ({
          id: shift.shift_id,
          date: shift.date,
          time: `${shift.start_time} - ${shift.end_time}`,
          location: shift.carehomes?.care_home_name || "Unknown",
          role: shift.role,
        }));
        setApprovedShifts(formattedShifts);
      }
    };

    fetchApprovedShifts();

    const subscription = supabase
      .channel("shifts_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shifts" },
        () => {
          fetchApprovedShifts();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Worker Dashboard" showWorkerName />
      </div>
      <div className="p-6 space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Upcoming Shifts"
            value={approvedShifts.length.toString()}
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
            description={`Next ${approvedShifts.length ? calculateDaysUntil(approvedShifts[0].date) : 0} days`}
          />
          <MetricCard
            title="Total Hours"
            value="156"
            icon={<Clock className="w-5 h-5 text-green-500" />}
            description="This month"
          />
          <MetricCard
            title="Completed Shifts"
            value="24"
            icon={<Briefcase className="w-5 h-5 text-purple-500" />}
            description="This month"
          />
          <MetricCard
            title="Average Rating"
            value="4.8"
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            description="Based on 24 reviews"
          />
        </div>

        {/* Earnings Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Earnings Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monthly Target</span>
                <span className="text-sm text-muted-foreground">£4,000</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-sm text-muted-foreground">
                £3,000 earned this month
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">£156.50</p>
                  <p className="text-sm text-muted-foreground">
                    Average daily rate
                  </p>
                </div>
                <BanknoteIcon className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </Card>

        {/* Upcoming Shifts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Shifts</h3>
          <div className="space-y-4">
            {approvedShifts.map((shift) => (
              <div
                key={shift.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:shadow-sm transition-all"
              >
                <div className="space-y-1">
                  <p className="font-medium">{shift.date}</p>
                  <p className="text-sm text-muted-foreground">{shift.time}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-medium">{shift.location}</p>
                  <p className="text-sm text-muted-foreground">{shift.role}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Shifts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
