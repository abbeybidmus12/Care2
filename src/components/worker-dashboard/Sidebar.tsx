import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  Settings,
  LogOut,
  Menu,
  Briefcase,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const defaultNavItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="w-5 h-5 text-blue-500" />,
    label: "Overview",
    href: "/care-worker-dashboard",
  },
  {
    icon: <Calendar className="w-5 h-5 text-green-500" />,
    label: "Available Shifts",
    href: "/care-worker-dashboard/available-shifts",
  },
  {
    icon: <Briefcase className="w-5 h-5 text-purple-500" />,
    label: "My Shifts",
    href: "/care-worker-dashboard/my-shifts",
  },
  {
    icon: <Clock className="w-5 h-5 text-orange-500" />,
    label: "Timesheets",
    href: "/care-worker-dashboard/timesheets",
  },
  {
    icon: <FileText className="w-5 h-5 text-indigo-500" />,
    label: "Payslips",
    href: "/care-worker-dashboard/payslips",
  },
  {
    icon: <Settings className="w-5 h-5 text-slate-500" />,
    label: "Settings",
    href: "/care-worker-dashboard/settings",
  },
];

const NavButton = ({ item }: { item: NavItem }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      onClick={() => navigate(item.href)}
      className={cn(
        "w-full relative overflow-hidden transition-all duration-300",
        "font-sans text-sm gap-x-2 flex-row justify-start items-center mx-0 font-medium h-11",
        "hover:bg-accent/80 hover:translate-x-1",
        item.isActive &&
          "bg-accent before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-500",
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </Button>
  );
};

const SidebarContent = ({ items = defaultNavItems }: { items?: NavItem[] }) => {
  const location = useLocation();

  const navItems = items.map((item) => ({
    ...item,
    isActive: location.pathname === item.href,
  }));

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-500" />
          <h2 className="text-lg font-semibold">CareWork</h2>
        </div>
      </div>
      <div className="flex-1 px-2 py-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <NavButton key={index} item={item} />
          ))}
        </nav>
      </div>
      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-4 px-4 text-red-500 hover:text-red-600"
          onClick={() => {
            const { clearSession } = useWorkerSession();
            clearSession();
            window.location.href = "/worker-signin";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

const WorkerSidebar = ({ className }: { className?: string }) => {
  return (
    <>
      <div
        className={cn(
          "hidden fixed h-screen w-72 flex-col border-r bg-background lg:flex",
          className,
        )}
      >
        <SidebarContent />
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed left-4 top-4 z-40">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WorkerSidebar;
