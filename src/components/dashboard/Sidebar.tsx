import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@/lib/hooks/useSession";
import {
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Users,
  ClipboardList,
  FileText,
  Settings,
  Bell,
  LogOut,
  Menu,
  AlertCircle,
  HeartPulse,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarProps {
  className?: string;
}

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
    href: "/care-home-dashboard",
    isActive: true,
  },
  {
    icon: <PlusCircle className="w-5 h-5 text-green-500" />,
    label: "Post Shift",
    href: "/care-home-dashboard/post-shift",
  },
  {
    icon: <Calendar className="w-5 h-5 text-purple-500" />,
    label: "Manage Shifts",
    href: "/care-home-dashboard/manage-shifts",
  },
  {
    icon: <Users className="w-5 h-5 text-orange-500" />,
    label: "Workers",
    href: "/care-home-dashboard/workers",
  },
  {
    icon: <ClipboardList className="w-5 h-5 text-cyan-500" />,
    label: "Timesheets",
    href: "/care-home-dashboard/timesheets",
  },
  {
    icon: <AlertCircle className="w-5 h-5 text-red-500" />,
    label: "Incident Reports",
    href: "/care-home-dashboard/incidents",
  },
  {
    icon: <FileText className="w-5 h-5 text-indigo-500" />,
    label: "Reports",
    href: "/care-home-dashboard/reports",
  },

  {
    icon: <Settings className="w-5 h-5 text-slate-500" />,
    label: "Settings",
    href: "/care-home-dashboard/settings",
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
  const navigate = useNavigate();

  const navItems = items.map((item) => ({
    ...item,
    isActive: location.pathname === item.href,
  }));
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <HeartPulse className="h-6 w-6 text-blue-500 animate-pulse" />
            <div className="absolute inset-0 h-6 w-6 bg-blue-500 blur-lg opacity-50 animate-pulse"></div>
          </div>
          <h2 className="text-lg font-semibold">CareBook</h2>
        </div>
      </div>
      <div className="flex-1 px-2 py-2 flex">
        <nav className="flex flex-col gap-1 w-full">
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
            const { clearSession } = useSession();
            clearSession();
            window.location.href = "/care-home-signin";
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

const Sidebar = ({ className }: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden fixed h-screen w-72 flex-col border-r bg-background lg:flex",
          className,
        )}
      >
        <SidebarContent className="w-[311px]" />
      </div>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="lg:hidden fixed left-4 top-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 lg:hidden">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
