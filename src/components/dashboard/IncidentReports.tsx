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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, FileText, Search } from "lucide-react";
import Header from "./Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type IncidentSeverity = "minor" | "moderate" | "serious" | "severe";
type IncidentStatus = "reported" | "resolved" | "dismissed";
type IncidentType =
  | "misconduct"
  | "negligence"
  | "unprofessional_behavior"
  | "abuse"
  | "policy_violation";

interface Worker {
  id: string;
  name: string;
  role: string;
}

interface Incident {
  id: string;
  date: string;
  time: string;
  location: string;
  reportedBy: string;
  type: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  accusedWorker: Worker;
  witnesses: Worker[];
  evidence: string;
  immediateAction: string;
  followUpAction?: string;
}

const mockWorkers: Worker[] = [
  { id: "W001", name: "Sarah Johnson", role: "Registered Nurse" },
  { id: "W002", name: "Michael Chen", role: "Care Assistant" },
  { id: "W003", name: "Emma Wilson", role: "Senior Nurse" },
  { id: "W004", name: "John Davis", role: "Support Worker" },
];

const mockIncidents: Record<IncidentStatus, Incident[]> = {
  reported: [
    {
      id: "INC001",
      date: "2024-03-20",
      time: "09:30",
      location: "Ward B",
      reportedBy: "Emma Wilson",
      type: "unprofessional_behavior",
      severity: "moderate",
      status: "reported",
      description:
        "Care worker displayed aggressive behavior towards residents and used inappropriate language",
      accusedWorker: mockWorkers[1],
      witnesses: [mockWorkers[0], mockWorkers[2]],
      evidence: "CCTV footage available, witness statements collected",
      immediateAction: "Worker suspended pending investigation",
    },
    {
      id: "INC002",
      date: "2024-03-19",
      time: "15:45",
      location: "Medication Room",
      reportedBy: "John Davis",
      type: "negligence",
      severity: "serious",
      status: "reported",
      description:
        "Failed to follow medication administration protocols and falsified records",
      accusedWorker: mockWorkers[3],
      witnesses: [mockWorkers[2]],
      evidence: "Medication records, staff testimony",
      immediateAction:
        "Immediate removal from medication duties, investigation initiated",
    },
  ],
  resolved: [],
  dismissed: [],
};

const getSeverityColor = (severity: IncidentSeverity) => {
  switch (severity) {
    case "minor":
      return "bg-blue-500";
    case "moderate":
      return "bg-yellow-500";
    case "serious":
      return "bg-orange-500";
    case "severe":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getStatusColor = (status: IncidentStatus) => {
  switch (status) {
    case "reported":
      return "text-red-500";

    case "resolved":
      return "text-green-500";
    case "dismissed":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
};

const NewIncidentForm = () => {
  const [selectedWorker, setSelectedWorker] = useState<string>("");
  const [witnesses, setWitnesses] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" placeholder="Enter incident location" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Incident Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select incident type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="misconduct">Misconduct</SelectItem>
              <SelectItem value="negligence">Negligence</SelectItem>
              <SelectItem value="unprofessional_behavior">
                Unprofessional Behavior
              </SelectItem>
              <SelectItem value="abuse">Abuse</SelectItem>
              <SelectItem value="policy_violation">Policy Violation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="severity">Severity</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select severity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="serious">Serious</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="datetime">Date & Time</Label>
          <Input type="datetime-local" id="datetime" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Accused Worker</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select worker" />
          </SelectTrigger>
          <SelectContent>
            {mockWorkers.map((worker) => (
              <SelectItem key={worker.id} value={worker.id}>
                {worker.name} ({worker.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Witnesses</Label>
        <div className="grid grid-cols-2 gap-2">
          {mockWorkers.map((worker) => (
            <div key={worker.id} className="flex items-center space-x-2">
              <Checkbox
                id={`witness-${worker.id}`}
                checked={witnesses.includes(worker.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setWitnesses([...witnesses, worker.id]);
                  } else {
                    setWitnesses(witnesses.filter((id) => id !== worker.id));
                  }
                }}
              />
              <label
                htmlFor={`witness-${worker.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {worker.name} ({worker.role})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Incident Description</Label>
        <Textarea
          id="description"
          placeholder="Provide a detailed description of the misconduct or incident..."
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidence">Evidence</Label>
        <Textarea
          id="evidence"
          placeholder="List any evidence (CCTV footage, documents, witness statements)..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="immediateAction">Immediate Actions Taken</Label>
        <Textarea
          id="immediateAction"
          placeholder="Describe immediate actions taken (e.g., suspension, duty changes)..."
          className="min-h-[80px]"
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Cancel</Button>
        <Button>Submit Report</Button>
      </div>
    </div>
  );
};

const IncidentTable = ({ incidents }: { incidents: Incident[] }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incidents..." className="pl-8" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <AlertCircle className="w-4 h-4 mr-2" />
              Report Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Worker Incident</DialogTitle>
              <DialogDescription>
                Report misconduct, negligence, or policy violations. All reports
                are treated confidentially.
              </DialogDescription>
            </DialogHeader>
            <NewIncidentForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Accused Worker</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>{incident.id}</TableCell>
                <TableCell>
                  {incident.date} {incident.time}
                </TableCell>
                <TableCell>{incident.accusedWorker.name}</TableCell>
                <TableCell>{incident.type.replace("_", " ")}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${getSeverityColor(
                      incident.severity,
                    )}`}
                  >
                    {incident.severity.charAt(0).toUpperCase() +
                      incident.severity.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-medium ${getStatusColor(incident.status)}`}
                  >
                    {incident.status.charAt(0).toUpperCase() +
                      incident.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{incident.reportedBy}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Incident Details</DialogTitle>
                        <DialogDescription>
                          Full report for incident {incident.id}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">
                              Incident Information
                            </h4>
                            <p className="text-sm">ID: {incident.id}</p>
                            <p className="text-sm">
                              Date: {incident.date} {incident.time}
                            </p>
                            <p className="text-sm">
                              Location: {incident.location}
                            </p>
                            <p className="text-sm">
                              Reported By: {incident.reportedBy}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">
                              Status Information
                            </h4>
                            <p className="text-sm">
                              Type: {incident.type.replace("_", " ")}
                            </p>
                            <p className="text-sm">
                              Severity: {incident.severity}
                            </p>
                            <p className="text-sm">Status: {incident.status}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Accused Worker</h4>
                          <p className="text-sm">
                            {incident.accusedWorker.name} (
                            {incident.accusedWorker.role})
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm">{incident.description}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Witnesses</h4>
                          <ul className="list-disc list-inside text-sm">
                            {incident.witnesses.map((witness, index) => (
                              <li key={index}>
                                {witness.name} ({witness.role})
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Evidence</h4>
                          <p className="text-sm">{incident.evidence}</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Actions Taken</h4>
                          <p className="text-sm">{incident.immediateAction}</p>
                          {incident.followUpAction && (
                            <p className="text-sm mt-2">
                              <strong>Follow-up:</strong>{" "}
                              {incident.followUpAction}
                            </p>
                          )}
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Update Status</Button>
                          <Button>Add Follow-up</Button>
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
  );
};

export default function IncidentReports() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Incident Reports" />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Tabs defaultValue="reported" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="reported">Reported</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>

            <TabsContent value="reported">
              <IncidentTable incidents={mockIncidents.reported} />
            </TabsContent>

            <TabsContent value="resolved">
              <IncidentTable incidents={mockIncidents.resolved} />
            </TabsContent>
            <TabsContent value="dismissed">
              <IncidentTable incidents={mockIncidents.dismissed} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
