import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Header from "../dashboard/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useWorkerSession } from "@/lib/hooks/useWorkerSession";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Shift {
  shiftId: string;
  date: string;
  role: string;
  careHome: string;
  postcode: string;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
}

const calculateHours = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let hours = endHour - startHour;
  const minutes = endMinute - startMinute;

  if (hours < 0) hours += 24; // Handle overnight shifts

  return hours + minutes / 60;
};

export default function AvailableShifts() {
  const { toast } = useToast();
  const { getSession } = useWorkerSession();

  const handleApplyShift = async (shiftId: string) => {
    const session = getSession();
    if (!session?.workerId) {
      toast({
        title: "Error",
        description: "You must be logged in to apply for shifts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("shifts")
        .update({
          status: "pending",
          worker_id: session.workerId,
          worker_name: session.name,
        })
        .eq("shift_id", shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Successfully applied for shift",
      });
    } catch (error) {
      console.error("Error applying for shift:", error);
      toast({
        title: "Error",
        description: "Failed to apply for shift",
        variant: "destructive",
      });
    }
  };
  const [shifts, setShifts] = useState<Shift[]>([]);

  useEffect(() => {
    const fetchShifts = async () => {
      const { data, error } = await supabase
        .from("shifts")
        .select("*, carehomes(care_home_name, postcode)")
        .eq("status", "active");

      if (error) {
        console.error("Error fetching shifts:", error);
        return;
      }

      if (data) {
        const formattedShifts = data.map((shift) => ({
          shiftId: shift.shift_id,
          date: shift.date,
          role: shift.role,
          careHome: shift.carehomes?.care_home_name || "Unknown",
          postcode: shift.carehomes?.postcode || "Unknown",
          startTime: shift.start_time,
          endTime: shift.end_time,
          hours: calculateHours(shift.start_time, shift.end_time),
          rate: shift.hourly_rate,
        }));
        setShifts(formattedShifts);
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
        <Header title="Available Shifts" showWorkerName />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="space-y-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search shifts..." className="pl-8" />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Showing {shifts.length} available shifts
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Distance</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="15">Within 15 miles</SelectItem>
                    <SelectItem value="20">Within 20 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shift Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day Shift</SelectItem>
                    <SelectItem value="night">Night Shift</SelectItem>
                    <SelectItem value="evening">Evening Shift</SelectItem>
                    <SelectItem value="longday">Long Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4-8">4-8 hours</SelectItem>
                    <SelectItem value="8-12">8-12 hours</SelectItem>
                    <SelectItem value="12+">12+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rate Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10-15">£10-£15/hr</SelectItem>
                    <SelectItem value="15-20">£15-£20/hr</SelectItem>
                    <SelectItem value="20-25">£20-£25/hr</SelectItem>
                    <SelectItem value="25+">£25+/hr</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Care Home</TableHead>
                  <TableHead>Post Code</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rate (£)</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.map((shift) => (
                  <TableRow key={shift.shiftId}>
                    <TableCell>{shift.shiftId}</TableCell>
                    <TableCell>{shift.date}</TableCell>
                    <TableCell>{shift.role}</TableCell>
                    <TableCell>{shift.careHome}</TableCell>
                    <TableCell>{shift.postcode}</TableCell>
                    <TableCell>{`${shift.startTime} - ${shift.endTime}`}</TableCell>
                    <TableCell>{shift.hours}</TableCell>
                    <TableCell>{shift.rate}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm">Apply</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Shift Details</DialogTitle>
                            <DialogDescription>
                              Review shift details before applying
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">
                                  Shift Information
                                </h4>
                                <p className="text-sm">ID: {shift.shiftId}</p>
                                <p className="text-sm">Date: {shift.date}</p>
                                <p className="text-sm">
                                  Time: {shift.startTime} - {shift.endTime}
                                </p>
                                <p className="text-sm">Hours: {shift.hours}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">
                                  Care Home Details
                                </h4>
                                <p className="text-sm">
                                  Name: {shift.careHome}
                                </p>
                                <p className="text-sm">
                                  Location: {shift.postcode}
                                </p>
                                <p className="text-sm">Role: {shift.role}</p>
                                <p className="text-sm">
                                  Rate: £{shift.rate}/hr
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <DialogTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogTrigger>
                              <Button
                                onClick={() => handleApplyShift(shift.shiftId)}
                              >
                                Book Shift
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
