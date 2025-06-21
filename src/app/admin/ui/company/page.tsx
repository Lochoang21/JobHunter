// app/company/page.tsx
import React from "react";
import CompanyTable from "@/app/components/companies/CompanyTable";

export default function CompanyPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
      </div>
      <CompanyTable />
    </div>
  );
}