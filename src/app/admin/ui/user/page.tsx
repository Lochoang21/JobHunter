// app/users/page.tsx
import React from "react";
import UserTable from "@/app/components/users/UserTable";
import CreateUser from "@/app/components/users/CreateUser";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
      </div>
      <UserTable />
    </div>
  );
}