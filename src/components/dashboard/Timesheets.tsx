import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, FileText, Star } from "lucide-react";
import Header from "./Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Timesheet {
  id: string;
  workerName: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  hourlyRate: number;
  paidBreak: boolean;
  status: "pending" | "approved" | "rejected";
}

const mockTimesheets: Record<Timesheet["status"], Timesheet[]> = {
  pending: [
    {
      id: "TS001",
      workerName: "Sarah Johnson",
      shiftDate: "2024-03-20",
      startTime: "09:00",
      endTime: "17:00",
      hoursWorked: 8,
      hourlyRate: 15,
      paidBreak: true,
      status: "pending",
    },
    {
      id: "TS002",
      workerName: "Michael Chen",
      shiftDate: "2024-03-21",
      startTime: "14:00",
      endTime: "22:00",
      hoursWorked: 8,
      hourlyRate: 12,
      paidBreak: false,
      status: "pending",
    },
  ],
  approved: [
    {
      id: "TS003",
      workerName: "Emma Wilson",
      shiftDate: "2024-03-19",
      startTime: "07:00",
      endTime: "15:00",
      hoursWorked: 8,
      hourlyRate: 14,
      paidBreak: true,
      status: "approved",
    },
  ],
  rejected: [
    {
      id: "TS004",
      workerName: "John Davis",
      shiftDate: "2024-03-18",
      startTime: "15:00",
      endTime: "23:00",
      hoursWorked: 8,
      hourlyRate: 13,
      paidBreak: false,
      status: "rejected",
    },
  ],
};

const StarRating = ({
  rating,
  setRating,
}: {
  rating: number;
  setRating: (r: number) => void;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 cursor-pointer ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        onClick={() => setRating(star)}
      />
    ))}
  </div>
);

const SignatureCanvas = ({ staffName }: { staffName: string }) => {
  const [signed, setSigned] = useState(false);
  const currentTime = new Date().toLocaleTimeString();

  return (
    <div
      onClick={() => setSigned(true)}
      className="border rounded-md p-4 bg-gray-50 min-h-[100px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
    >
      {signed ? (
        <div className="text-center">
          <p className="font-medium text-blue-600 font-serif text-lg">
            {staffName}
          </p>
          <p className="text-sm text-gray-500">{currentTime}</p>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Click to sign</p>
      )}
    </div>
  );
};

const TimesheetTable = ({ timesheets }: { timesheets: Timesheet[] }) => {
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(
    null,
  );
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [paidBreak, setPaidBreak] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timesheet ID</TableHead>
              <TableHead>Worker Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Break</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheets.map((timesheet) => (
              <TableRow key={timesheet.id}>
                <TableCell>{timesheet.id}</TableCell>
                <TableCell>{timesheet.workerName}</TableCell>
                <TableCell>{timesheet.shiftDate}</TableCell>
                <TableCell>{`${timesheet.startTime} - ${timesheet.endTime}`}</TableCell>
                <TableCell>{timesheet.hoursWorked}</TableCell>
                <TableCell>
                  {timesheet.paidBreak ? (
                    <span className="text-green-600">Paid</span>
                  ) : (
                    <span className="text-gray-500">Unpaid</span>
                  )}
                </TableCell>
                <TableCell>
                  £{(timesheet.hoursWorked * timesheet.hourlyRate).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTimesheet(timesheet);
                            setPaidBreak(timesheet.paidBreak);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Timesheet</DialogTitle>
                          <DialogDescription>
                            Review and approve or reject the timesheet
                            submission.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Worker Details
                              </h4>
                              <p className="text-sm">ID: {timesheet.id}</p>
                              <p className="text-sm">
                                Name: {timesheet.workerName}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">
                                Shift Details
                              </h4>
                              <p className="text-sm">
                                Date: {timesheet.shiftDate}
                              </p>
                              <p className="text-sm">
                                Time: {timesheet.startTime} -{" "}
                                {timesheet.endTime}
                              </p>
                              <p className="text-sm">
                                Hours Worked: {timesheet.hoursWorked}
                              </p>
                              <p className="text-sm font-medium text-green-600">
                                Total Amount: £
                                {(
                                  timesheet.hoursWorked * timesheet.hourlyRate
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-4">
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">Rating</h4>
                              <StarRating
                                rating={rating}
                                setRating={setRating}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium mb-2">
                                Digital Signature
                              </h4>
                              <SignatureCanvas staffName="John Smith" />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="paidBreak"
                              checked={paidBreak}
                              onCheckedChange={(checked) =>
                                setPaidBreak(checked as boolean)
                              }
                            />
                            <label
                              htmlFor="paidBreak"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Paid Break
                            </label>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Comments</h4>
                            <Textarea
                              placeholder="Add your comments here..."
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              className="h-20"
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              variant="destructive"
                              onClick={() => console.log("Rejected")}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => console.log("Approved")}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default function Timesheets() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Timesheets" />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <TimesheetTable timesheets={mockTimesheets.pending} />
            </TabsContent>
            <TabsContent value="approved">
              <TimesheetTable timesheets={mockTimesheets.approved} />
            </TabsContent>
            <TabsContent value="rejected">
              <TimesheetTable timesheets={mockTimesheets.rejected} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
