// app/resume/page.tsx
import React from "react";
import ResumeTable from "@/app/components/resume/ResumeTable";

export default function ResumePage() {
  return (
    <div className="container mx-auto p-4">
      <ResumeTable />
    </div>
  );
}