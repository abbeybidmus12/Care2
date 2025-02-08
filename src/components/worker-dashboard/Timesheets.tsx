import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { FileText, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type TimesheetStatus = "pending" | "approved";

interface Timesheet {
  id: string;
  shiftId: string;
  date: string;
  careHome: string;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
  status: TimesheetStatus;
}

const mockTimesheets: Record<TimesheetStatus, Timesheet[]> = {
  pending: [
    {
      id: "TS001",
      shiftId: "SH001",
      date: "2024-03-25",
      careHome: "Sunshine Care Home",
      startTime: "07:00",
      endTime: "15:00",
      hours: 8,
      rate: 25,
      status: "pending",
    },
  ],
  approved: [
    {
      id: "TS002",
      shiftId: "SH002",
      date: "2024-03-24",
      careHome: "Oak Lodge",
      startTime: "14:00",
      endTime: "22:00",
      hours: 8,
      rate: 20,
      status: "approved",
    },
  ],
};

const SignatureCanvas = ({ onSign }: { onSign: () => void }) => {
  const [signed, setSigned] = useState(false);
  const currentTime = new Date().toLocaleTimeString();

  const handleSign = () => {
    setSigned(true);
    onSign();
  };

  return (
    <div
      onClick={handleSign}
      className="border rounded-md p-4 bg-gray-50 min-h-[100px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
    >
      {signed ? (
        <div className="text-center">
          <p className="font-medium text-blue-600 font-serif text-lg">
            John Smith
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
  const [isSigned, setIsSigned] = useState(false);

  const handleSubmit = () => {
    console.log("Timesheet submitted", selectedTimesheet);
    setSelectedTimesheet(null);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timesheet ID</TableHead>
            <TableHead>Shift ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Care Home</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Hours</TableHead>
            <TableHead>Rate (£)</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.map((timesheet) => (
            <TableRow key={timesheet.id}>
              <TableCell>{timesheet.id}</TableCell>
              <TableCell>{timesheet.shiftId}</TableCell>
              <TableCell>{timesheet.date}</TableCell>
              <TableCell>{timesheet.careHome}</TableCell>
              <TableCell>
                {timesheet.startTime} - {timesheet.endTime}
              </TableCell>
              <TableCell>{timesheet.hours}</TableCell>
              <TableCell>{timesheet.rate}</TableCell>
              <TableCell>
                £{(timesheet.hours * timesheet.rate).toFixed(2)}
              </TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTimesheet(timesheet);
                        setIsSigned(false);
                      }}
                    >
                      {timesheet.status === "pending" ? (
                        <>
                          <Pencil className="w-4 h-4 mr-2" />
                          Sign
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          View
                        </>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {timesheet.status === "pending"
                          ? "Sign Timesheet"
                          : "Timesheet Details"}
                      </DialogTitle>
                      <DialogDescription>
                        {timesheet.status === "pending"
                          ? "Please review and sign your timesheet"
                          : "View your approved timesheet details"}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Shift Details</h4>
                          <p className="text-sm">ID: {timesheet.id}</p>
                          <p className="text-sm">
                            Care Home: {timesheet.careHome}
                          </p>
                          <p className="text-sm">Date: {timesheet.date}</p>
                          <p className="text-sm">
                            Time: {timesheet.startTime} - {timesheet.endTime}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Payment Details</h4>
                          <p className="text-sm">Hours: {timesheet.hours}</p>
                          <p className="text-sm">Rate: £{timesheet.rate}/hr</p>
                          <p className="text-sm font-medium text-green-600">
                            Total: £
                            {(timesheet.hours * timesheet.rate).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {timesheet.status === "pending" && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Digital Signature</h4>
                          <SignatureCanvas onSign={() => setIsSigned(true)} />
                          <p className="text-xs text-muted-foreground">
                            By signing, you confirm that the above information
                            is correct
                          </p>
                        </div>
                      )}

                      {timesheet.status === "pending" && (
                        <div className="flex justify-end">
                          <Button onClick={handleSubmit} disabled={!isSigned}>
                            Submit Timesheet
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default function Timesheets() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Timesheets" showWorkerName />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <TimesheetTable timesheets={mockTimesheets.pending} />
            </TabsContent>
            <TabsContent value="approved">
              <TimesheetTable timesheets={mockTimesheets.approved} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
