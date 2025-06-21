// app/users/page.tsx
import React from "react";
import JobTable from "@/app/components/jobs/JobTable";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
      </div>
      <JobTable />
    </div>
  );
}