import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clock, FileText, Users, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  tooltip: string;
}

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    icon: <PlusCircle className="w-5 h-5" />,
    label: "Post New Shift",
    onClick: () => (window.location.pathname = "/dashboard/post-shift"),
    tooltip: "Create a new shift posting",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "View Timesheets",
    onClick: () => console.log("View Timesheets clicked"),
    tooltip: "View and manage timesheets",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    label: "Reports",
    onClick: () => console.log("Reports clicked"),
    tooltip: "Access shift reports",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Manage Staff",
    onClick: () => console.log("Manage Staff clicked"),
    tooltip: "Manage care home staff",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    onClick: () => console.log("Settings clicked"),
    tooltip: "Adjust dashboard settings",
  },
];

const QuickActions = ({ actions = defaultActions }: QuickActionsProps) => {
  return (
    <div className="w-full bg-white/95 p-5 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        <TooltipProvider>
          {actions.map((action, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 transition-colors hover:bg-slate-100 w-full justify-start"
                  onClick={action.onClick}
                >
                  {action.icon}
                  <span className="inline">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{action.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default QuickActions;
