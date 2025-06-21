// app/users/page.tsx
import SkillTable from "@/app/components/skills/SkillTable";
import React from "react";


export default function UsersPage() {
  return (
    <div className="container mx-auto p-4">
      <SkillTable/>
    </div>
  );
}