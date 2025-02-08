import React, { useState, useEffect } from "react";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import { supabase } from "@/lib/supabase";
import Header from "../dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type ShiftStatus = "pending" | "approved" | "completed";

interface Shift {
  id: string;
  date: string;
  careHome: string;
  role: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
  status: ShiftStatus;
}

const calculateHours = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let hours = endHour - startHour;
  const minutes = endMinute - startMinute;

  if (hours < 0) hours += 24; // Handle overnight shifts

  return hours + minutes / 60;
};

const ShiftTable = ({ shifts }: { shifts: Shift[] }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Shift ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Care Home</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Hours</TableHead>
          <TableHead>Rate (£)</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shifts.map((shift) => (
          <TableRow key={shift.id}>
            <TableCell>{shift.id}</TableCell>
            <TableCell>{shift.date}</TableCell>
            <TableCell>{shift.careHome}</TableCell>
            <TableCell>{shift.role}</TableCell>
            <TableCell>
              <Badge variant="outline">{shift.shiftType}</Badge>
            </TableCell>
            <TableCell>{`${shift.startTime} - ${shift.endTime}`}</TableCell>
            <TableCell>{shift.hours}</TableCell>
            <TableCell>{shift.rate}</TableCell>
            <TableCell>£{(shift.hours * shift.rate).toFixed(2)}</TableCell>
            <TableCell>
              <Button size="sm" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function MyShifts() {
  const { getSession } = useWorkerSession();
  const [shifts, setShifts] = useState<Record<ShiftStatus, Shift[]>>({
    pending: [],
    approved: [],
    completed: [],
  });

  useEffect(() => {
    const fetchShifts = async () => {
      const session = getSession();
      if (!session?.workerId) return;

      const { data, error } = await supabase
        .from("shifts")
        .select("*, carehomes(care_home_name)")
        .eq("worker_id", session.workerId);

      if (error) {
        console.error("Error fetching shifts:", error);
        return;
      }

      if (data) {
        const groupedShifts = data.reduce(
          (acc, shift) => {
            const status = shift.status as ShiftStatus;
            if (
              status === "pending" ||
              status === "approved" ||
              status === "completed"
            ) {
              const formattedShift: Shift = {
                id: shift.shift_id,
                date: shift.date,
                careHome: shift.carehomes?.care_home_name || "Unknown",
                role: shift.role,
                shiftType: "Day", // You might want to add this to your database
                startTime: shift.start_time,
                endTime: shift.end_time,
                hours: calculateHours(shift.start_time, shift.end_time),
                rate: shift.hourly_rate,
                status: status,
              };
              return {
                ...acc,
                [status]: [...(acc[status] || []), formattedShift],
              };
            }
            return acc;
          },
          { pending: [], approved: [], completed: [] } as Record<
            ShiftStatus,
            Shift[]
          >,
        );

        setShifts(groupedShifts);
      }
    };

    fetchShifts();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("shifts_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shifts" },
        (payload) => {
          fetchShifts(); // Refetch all shifts when any change occurs
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
        <Header title="My Shifts" showWorkerName />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <ShiftTable shifts={shifts.pending} />
            </TabsContent>
            <TabsContent value="approved">
              <ShiftTable shifts={shifts.approved} />
            </TabsContent>
            <TabsContent value="completed">
              <ShiftTable shifts={shifts.completed} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
