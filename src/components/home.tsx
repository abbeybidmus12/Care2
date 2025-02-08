import React from "react";
import Sidebar from "./dashboard/Sidebar";
import Overview from "./dashboard/Overview";

interface HomeProps {
  metrics?: {
    activeShifts: number;
    availableWorkers: number;
    urgentNeeds: number;
  };
  shifts?: {
    id: string;
    date: string;
    time: string;
    department: string;
    position: string;
    status: "open" | "filled" | "urgent";
  }[];
}

const Home = ({
  metrics = {
    activeShifts: 12,
    availableWorkers: 8,
    urgentNeeds: 3,
  },
  shifts = [
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
  ],
}: HomeProps) => {
  return <Overview metrics={metrics} shifts={shifts} />;
};

export default Home;
