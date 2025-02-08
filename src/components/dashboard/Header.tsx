import React from "react";
import { Bell } from "lucide-react";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import { useSession } from "@/lib/hooks/useSession";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Notifications from "./Notifications";

interface HeaderProps {
  title?: string;
  showWorkerName?: boolean;
}

export default function Header({
  title = "Overview",
  showWorkerName = false,
}: HeaderProps) {
  const { getSession: getWorkerSession } = useWorkerSession();
  const { getSession: getCareHomeSession } = useSession();
  const workerSession = getWorkerSession();
  const careHomeSession = getCareHomeSession();

  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="flex items-center gap-4">
          {showWorkerName && workerSession?.name && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {workerSession.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{workerSession.name}</span>
            </div>
          )}
          {!showWorkerName && careHomeSession?.name && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                {careHomeSession.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">
                {careHomeSession.name}
              </span>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0">
              <Notifications />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
