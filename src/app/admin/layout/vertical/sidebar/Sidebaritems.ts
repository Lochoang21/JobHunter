export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  permission?: string;
  role?: string;
  module?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
  permission?: string;
  role?: string;
  module?: string;
}

import { uniqueId } from "lodash";

const SidebarContent: MenuItem[] = [
  {
    heading: "HOME",
    children: [
      {
        name: "Dashboard",
        icon: "solar:widget-add-line-duotone",
        id: uniqueId(),
        url: "/admin",
      },
    ],
  },
  {
    heading: "TABS MANAGEMENT",
    children: [
      {
        name: "User",
        icon: "solar:user-circle-linear",
        id: uniqueId(),
        url: "/admin/ui/user",
        module: "users",
      },
      {
        name: "Company",
        icon: "solar:buildings-2-outline",
        id: uniqueId(),
        url: "/admin/ui/company",
        module: "companies",
      },
      {
        name: "Job",
        icon: "solar:letter-opened-linear",
        id: uniqueId(),
        url: "/admin/ui/job",
        module: "jobs",
      },
      {
        name: "Skill",
        icon: "solar:programming-broken",
        id: uniqueId(),
        url: "/admin/ui/skill",
        module: "skills",
      },
      {
        name: "Resume",
        icon: "solar:clipboard-list-linear",
        id: uniqueId(),
        url: "/admin/ui/resume",
        module: "resumes",
      },
      {
        name: "Permission",
        icon: "solar:shield-user-outline",
        id: uniqueId(),
        url: "/admin/ui/permission",
        module: "permissions",
      },
      {
        name: "Role",
        icon: "solar:user-check-rounded-outline",
        id: uniqueId(),
        url: "/admin/ui/role",
        module: "roles",
      },
      {
        name: "Form",
        icon: "solar:password-minimalistic-outline",
        id: uniqueId(),
        url: "/admin/ui/form",
        role: "SUPER_ADMIN",
      },
    ],
  },
];

export default SidebarContent;
