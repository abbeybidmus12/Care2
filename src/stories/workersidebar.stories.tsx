import WorkerSidebar from "../components/worker-dashboard/Sidebar.tsx";
import React from "react";

export const Default = {
  render: () => {
    return (
      <>
        <WorkerSidebar />
      </>
    );
  },
};

export default {
  title: "Tempo/Default",
  component: WorkerSidebar,
};
