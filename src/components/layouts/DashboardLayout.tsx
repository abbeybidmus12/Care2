import Sidebar from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";
export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-background mx-[1.75px] py-0">
      <Sidebar className="gap-y-1" />
      <div className="flex-1 ml-0 lg:ml-72">
        <Outlet />
      </div>
    </div>
  );
}
