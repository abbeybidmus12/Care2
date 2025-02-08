import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "./Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Download,
  BarChart3,
  AlertCircle,
  Clock,
  Users,
} from "lucide-react";

type ReportType = "incidents" | "shifts" | "workers" | "timesheets";

interface ReportConfig {
  type: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  metrics: string[];
}

const reportConfigs: ReportConfig[] = [
  {
    type: "incidents",
    title: "Incident Reports",
    description: "Analyze worker misconduct, complaints, and resolutions",
    icon: <AlertCircle className="w-5 h-5" />,
    metrics: [
      "Total incidents",
      "Incidents by type",
      "Resolution rate",
      "Average resolution time",
      "Repeat offenders",
      "Severity distribution",
    ],
  },
  {
    type: "shifts",
    title: "Shift Analytics",
    description: "Track shift patterns, coverage, and worker performance",
    icon: <Clock className="w-5 h-5" />,
    metrics: [
      "Shift completion rate",
      "Worker punctuality",
      "Overtime hours",
      "Shift cancellations",
      "Coverage gaps",
    ],
  },
  {
    type: "workers",
    title: "Worker Performance",
    description: "Evaluate worker ratings, reliability, and history",
    icon: <Users className="w-5 h-5" />,
    metrics: [
      "Average ratings",
      "Attendance rate",
      "Incident involvement",
      "Shift preferences",
      "Qualifications",
    ],
  },
  {
    type: "timesheets",
    title: "Timesheet Analysis",
    description: "Review work hours, payments, and attendance patterns",
    icon: <FileText className="w-5 h-5" />,
    metrics: [
      "Total hours worked",
      "Overtime trends",
      "Payment summaries",
      "Break compliance",
      "Time tracking accuracy",
    ],
  },
];

const ReportForm = () => {
  const [selectedType, setSelectedType] = useState<ReportType>("incidents");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);

  const currentConfig = reportConfigs.find(
    (config) => config.type === selectedType,
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select
            value={selectedType}
            onValueChange={(value: ReportType) => setSelectedType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportConfigs.map((config) => (
                <SelectItem key={config.type} value={config.type}>
                  <div className="flex items-center gap-2">
                    {config.icon}
                    {config.title}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input type="date" placeholder="Start date" />
            <Input type="date" placeholder="End date" />
          </div>
        </div>
      </div>

      {currentConfig && (
        <div className="space-y-4">
          <Label>Select Metrics</Label>
          <div className="grid grid-cols-2 gap-4">
            {currentConfig.metrics.map((metric) => (
              <div key={metric} className="flex items-center space-x-2">
                <Checkbox
                  id={metric}
                  checked={selectedMetrics.includes(metric)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedMetrics([...selectedMetrics, metric]);
                    } else {
                      setSelectedMetrics(
                        selectedMetrics.filter((m) => m !== metric),
                      );
                    }
                  }}
                />
                <label
                  htmlFor={metric}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {metric}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export as PDF
        </Button>
        <Button>
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default function Reports() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Reports" />
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {reportConfigs.map((config) => (
            <Card
              key={config.type}
              className="p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  {config.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{config.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {config.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 p-6">
          <h2 className="text-lg font-semibold mb-4">Generate Custom Report</h2>
          <ReportForm />
        </Card>
      </div>
    </div>
  );
}
