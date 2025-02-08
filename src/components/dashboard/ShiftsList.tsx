import React from "react";
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
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ShiftStatus = "open" | "filled" | "urgent";

interface Shift {
  id: string;
  date: string;
  time: string;
  department: string;
  position: string;
  status: ShiftStatus;
}

interface ShiftsListProps {
  shifts?: Shift[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ShiftStatus) => void;
}

const getStatusColor = (status: ShiftStatus) => {
  switch (status) {
    case "open":
      return "bg-blue-500";
    case "filled":
      return "bg-green-500";
    case "urgent":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const defaultShifts: Shift[] = [
  {
    id: "1",
    date: "2024-03-20",
    time: "09:00 - 17:00",
    department: "Nursing",
    position: "Registered Nurse",
    status: "open",
  },
  {
    id: "2",
    date: "2024-03-21",
    time: "14:00 - 22:00",
    department: "Care Staff",
    position: "Care Assistant",
    status: "filled",
  },
  {
    id: "3",
    date: "2024-03-22",
    time: "22:00 - 06:00",
    department: "Nursing",
    position: "Senior Nurse",
    status: "urgent",
  },
];

const ShiftsList = ({
  shifts = defaultShifts,
  onEdit = () => {},
  onDelete = () => {},
  onStatusChange = () => {},
}: ShiftsListProps) => {
  return (
    <div className="w-full bg-white/95 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300 p-5 backdrop-blur supports-[backdrop-filter]:bg-white/80 overflow-x-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Current Shifts</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell>{shift.date}</TableCell>
                <TableCell>{shift.time}</TableCell>
                <TableCell>{shift.department}</TableCell>
                <TableCell>{shift.position}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(shift.status)} text-white`}
                  >
                    {shift.status.charAt(0).toUpperCase() +
                      shift.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(shift.id)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(shift.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(shift.id, "open")}
                      >
                        Mark as Open
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(shift.id, "filled")}
                      >
                        Mark as Filled
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onStatusChange(shift.id, "urgent")}
                      >
                        Mark as Urgent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ShiftsList;
