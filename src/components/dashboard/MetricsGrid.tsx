import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  progress?: number;
  variant?: "default" | "success" | "warning" | "danger";
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon,
  description,
  trend = 0,
  progress = 0,
  variant = "default",
}: MetricCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          icon: "text-green-500",
          progress: "bg-green-100 [&>div]:bg-green-500",
        };
      case "warning":
        return {
          icon: "text-yellow-500",
          progress: "bg-yellow-100 [&>div]:bg-yellow-500",
        };
      case "danger":
        return {
          icon: "text-red-500",
          progress: "bg-red-100 [&>div]:bg-red-500",
        };
      default:
        return {
          icon: "text-primary",
          progress: "bg-primary/10 [&>div]:bg-primary",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md hover:scale-[1.02] duration-300 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 p-4">
      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 translate-y-[-8px] opacity-[0.03]">
        {icon}
      </div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-5 w-5 ${styles.icon}`}>{icon}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {trend !== 0 && (
            <div
              className={`text-sm font-medium ${trend > 0 ? "text-green-500" : "text-red-500"}`}
            >
              {trend > 0 ? "+" : ""}
              {trend}%
            </div>
          )}
        </div>
        {progress > 0 && (
          <Progress value={progress} className={`h-1.5 ${styles.progress}`} />
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricsGridProps {
  metrics?: {
    activeShifts: number;
    availableWorkers: number;
    urgentNeeds: number;
  };
}

const MetricsGrid = ({
  metrics = {
    activeShifts: 12,
    availableWorkers: 8,
    urgentNeeds: 3,
  },
}: MetricsGridProps) => {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        title="Active Shifts"
        value={metrics.activeShifts.toString()}
        icon={<Calendar className="h-4 w-4" />}
        description="Total active shifts this week"
        trend={15}
        progress={75}
        variant="default"
      />
      <MetricCard
        title="Available Workers"
        value={metrics.availableWorkers.toString()}
        icon={<Users className="h-4 w-4" />}
        description="Workers ready for assignment"
        trend={-5}
        progress={40}
        variant="warning"
      />
      <MetricCard
        title="Urgent Needs"
        value={metrics.urgentNeeds.toString()}
        icon={<AlertTriangle className="h-4 w-4" />}
        description="Shifts requiring immediate attention"
        trend={8}
        progress={25}
        variant="danger"
      />
    </div>
  );
};

export default MetricsGrid;
