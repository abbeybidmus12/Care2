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
import { MoreHorizontal, Star, AlertCircle, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "./Header";

type WorkerCategory = "all" | "priority" | "lowRated" | "blacklisted";

interface Worker {
  id: string;
  name: string;
  role: string;
  experience: number;
  shiftsCompleted: number;
  rating: number;
  status: WorkerCategory;
}

const mockWorkers: Record<WorkerCategory, Worker[]> = {
  all: [
    {
      id: "CW001",
      name: "Sarah Johnson",
      role: "Registered Nurse",
      experience: 5,
      shiftsCompleted: 120,
      rating: 4.8,
      status: "all",
    },
    {
      id: "CW002",
      name: "Michael Chen",
      role: "Care Assistant",
      experience: 3,
      shiftsCompleted: 85,
      rating: 4.5,
      status: "all",
    },
  ],
  priority: [
    {
      id: "CW003",
      name: "Emma Thompson",
      role: "Senior Nurse",
      experience: 8,
      shiftsCompleted: 200,
      rating: 4.9,
      status: "priority",
    },
  ],
  lowRated: [
    {
      id: "CW004",
      name: "James Wilson",
      role: "Support Worker",
      experience: 1,
      shiftsCompleted: 15,
      rating: 2.5,
      status: "lowRated",
    },
  ],
  blacklisted: [
    {
      id: "CW005",
      name: "Lisa Brown",
      role: "Care Assistant",
      experience: 2,
      shiftsCompleted: 30,
      rating: 1.8,
      status: "blacklisted",
    },
  ],
};

const WorkerTable = ({ workers }: { workers: Worker[] }) => (
  <div className="rounded-md border mt-4">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Years of Experience</TableHead>
          <TableHead>Shifts Completed</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workers.map((worker) => (
          <TableRow key={worker.id}>
            <TableCell>{worker.id}</TableCell>
            <TableCell>{worker.name}</TableCell>
            <TableCell>{worker.role}</TableCell>
            <TableCell>{worker.experience}</TableCell>
            <TableCell>{worker.shiftsCompleted}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{worker.rating.toFixed(1)}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Star className="mr-2 h-4 w-4" />
                    Add to Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Flag for Review
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Ban className="mr-2 h-4 w-4" />
                    Blacklist
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default function Workers() {
  return (
    <div className="flex flex-col bg-gradient-to-br from-slate-50/50 to-slate-100/50 min-h-screen">
      <div className="sticky top-0 z-40">
        <Header title="Workers" />
      </div>
      <div className="p-6">
        <div className="w-full bg-white/95 rounded-lg border shadow-sm p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All Workers</TabsTrigger>
              <TabsTrigger value="priority">Priority List</TabsTrigger>
              <TabsTrigger value="lowRated">Least Ratings</TabsTrigger>
              <TabsTrigger value="blacklisted">Blacklist</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <WorkerTable workers={mockWorkers.all} />
            </TabsContent>
            <TabsContent value="priority">
              <WorkerTable workers={mockWorkers.priority} />
            </TabsContent>
            <TabsContent value="lowRated">
              <WorkerTable workers={mockWorkers.lowRated} />
            </TabsContent>
            <TabsContent value="blacklisted">
              <WorkerTable workers={mockWorkers.blacklisted} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
