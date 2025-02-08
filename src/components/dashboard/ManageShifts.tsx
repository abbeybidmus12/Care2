import { useState, useEffect } from "react";
import { useSession } from "@/lib/hooks/useSession";
import { supabase } from "@/lib/supabase";
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
import { MoreHorizontal, Edit2, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "./Header";

type ShiftStatus = "active" | "pending" | "approved" | "rejected";

interface Shift {
  id: string;
  date: string;
  time: string;
  role: string;
  duration: string;
  pay: number;
  status: ShiftStatus;
  worker_id?: string;
  worker_name?: string;
}

interface WorkerDetails {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  preferred_role: string;
  years_experience: string;
  completed_shifts: Array<{ date: string; careHome: string; duration: string }>;
}

const emptyShifts: Record<ShiftStatus, Shift[]> = {
  active: [],
  pending: [],
  approved: [],
  rejected: [],
};

const calculateHours = (startTime: string, endTime: string) => {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  let hours = endHour - startHour;
  const minutes = endMinute - startMinute;

  if (hours < 0) hours += 24; // Handle overnight shifts

  return hours + minutes / 60;
};

const getStatusColor = (status: ShiftStatus) => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "approved":
      return "bg-blue-500";
    case "rejected":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export default function ManageShifts() {
  const { toast } = useToast();
  const { getSession } = useSession();
  const [activeTab, setActiveTab] = useState<ShiftStatus>("active");
  const [shifts, setShifts] = useState(emptyShifts);
  const [workerDetails, setWorkerDetails] = useState<WorkerDetails | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchWorkerDetails = async (workerId: string) => {
    try {
      const { data, error } = await supabase
        .from("careworkers")
        .select("*")
        .eq("careworkerid", workerId)
        .single();

      if (error) throw error;

      if (data) {
        setWorkerDetails({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || "Not provided",
          preferred_role: data.preferred_role || "Not specified",
          years_experience: data.years_experience || "Not specified",
          completed_shifts: data.completed_shifts || [],
        });
      }
    } catch (error) {
      console.error("Error fetching worker details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch worker details",
        variant: "destructive",
      });
    }
  };

  const handleApproveShift = async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from("shifts")
        .update({ status: "approved" })
        .eq("shift_id", shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift approved successfully",
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Error approving shift:", error);
      toast({
        title: "Error",
        description: "Failed to approve shift",
        variant: "destructive",
      });
    }
  };

  const handleRejectShift = async (shiftId: string) => {
    try {
      const { error } = await supabase
        .from("shifts")
        .update({ status: "rejected" })
        .eq("shift_id", shiftId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Shift rejected successfully",
      });
      setDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting shift:", error);
      toast({
        title: "Error",
        description: "Failed to reject shift",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchShifts = async () => {
      const session = getSession();
      if (!session?.careHomeId) return;

      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("care_home_id", session.careHomeId);

      if (error) {
        console.error("Error fetching shifts:", error);
        return;
      }

      if (data) {
        const groupedShifts = data.reduce((acc, shift) => {
          const status = shift.status as ShiftStatus;
          return {
            ...acc,
            [status]: [
              ...(acc[status] || []),
              {
                id: shift.shift_id,
                date: shift.date,
                time: `${shift.start_time} - ${shift.end_time}`,
                role: shift.role,
                duration: `${calculateHours(shift.start_time, shift.end_time)} hours`,
                staff_required: shift.staff_required,
                pay:
                  calculateHours(shift.start_time, shift.end_time) *
                  shift.hourly_rate,
                status: shift.status,
                worker_id: shift.worker_id,
                worker_name: shift.worker_name,
              },
            ],
          };
        }, emptyShifts);

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

  const ShiftTable = ({ shifts }: { shifts: Shift[] }) => (
    <div className="rounded-md border mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Shift ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Shift Pay</TableHead>
            {activeTab !== "active" && <TableHead>Worker</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell>{shift.id}</TableCell>
              <TableCell>{shift.date}</TableCell>
              <TableCell>{shift.time}</TableCell>
              <TableCell>{shift.role}</TableCell>
              <TableCell>{shift.duration}</TableCell>
              <TableCell>£{shift.pay}</TableCell>
              {activeTab !== "active" && (
                <TableCell>{shift.worker_name || "-"}</TableCell>
              )}
              <TableCell className="text-right">
                {activeTab === "pending" ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (shift.worker_id) {
                            fetchWorkerDetails(shift.worker_id);
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Worker
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Worker Details</DialogTitle>
                        <DialogDescription>
                          Review worker information and completed shifts
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">
                              Worker Information
                            </h4>
                            {workerDetails ? (
                              <>
                                <p className="text-sm">
                                  Name: {workerDetails.first_name}{" "}
                                  {workerDetails.last_name}
                                </p>
                                <p className="text-sm">
                                  Email: {workerDetails.email}
                                </p>
                                <p className="text-sm">
                                  Phone: {workerDetails.phone}
                                </p>
                                <p className="text-sm">
                                  Role: {workerDetails.preferred_role}
                                </p>
                                <p className="text-sm">
                                  Experience: {workerDetails.years_experience}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Loading worker details...
                              </p>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Shift Details</h4>
                            <p className="text-sm">Date: {shift.date}</p>
                            <p className="text-sm">Time: {shift.time}</p>
                            <p className="text-sm">
                              Duration: {shift.duration}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Completed Shifts</h4>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Care Home</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {workerDetails?.completed_shifts?.length ? (
                                  workerDetails.completed_shifts.map(
                                    (completedShift, index) => (
                                      <TableRow key={index}>
                                        <TableCell>
                                          {completedShift.date}
                                        </TableCell>
                                        <TableCell>
                                          {completedShift.careHome}
                                        </TableCell>
                                        <TableCell>
                                          {completedShift.duration}
                                        </TableCell>
                                        <TableCell>
                                          <Badge
                                            variant="outline"
                                            className="bg-green-50"
                                          >
                                            Completed
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={4}
                                      className="text-center text-muted-foreground"
                                    >
                                      No completed shifts
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleRejectShift(shift.id)}
                          >
                            Reject
                          </Button>
                          <Button onClick={() => handleApproveShift(shift.id)}>
                            Approve
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Manage Shifts" />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Tabs
            defaultValue="active"
            className="w-full"
            onValueChange={(value) => setActiveTab(value as ShiftStatus)}
          >
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <ShiftTable shifts={shifts.active} />
            </TabsContent>
            <TabsContent value="pending">
              <ShiftTable shifts={shifts.pending} />
            </TabsContent>
            <TabsContent value="approved">
              <ShiftTable shifts={shifts.approved} />
            </TabsContent>
            <TabsContent value="rejected">
              <ShiftTable shifts={shifts.rejected} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
