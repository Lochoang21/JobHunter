export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
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
    heading: "UTILITIES",
    children: [
      {
        name: "User",
        icon: "solar:user-circle-linear",
        id: uniqueId(),
        url: "/admin/ui/user",
      },
      {
        name: "Company",
        icon: "solar:buildings-2-outline",
        id: uniqueId(),
        url: "/admin/ui/company",
      },
      {
        name: "Job",
        icon: "solar:letter-opened-linear",
        id: uniqueId(),
        url: "/admin/ui/job",
      },
      {
        name: "Skill",
        icon: "solar:programming-broken",
        id: uniqueId(),
        url: "/admin/ui/skill",
      },
      {
        name: "Resume",
        icon: "solar:clipboard-list-linear",
        id: uniqueId(),
        url: "/admin/ui/resume",
      },
      {
        name: "Permission",
        icon: "solar:shield-user-outline",
        id: uniqueId(),
        url: "/admin/ui/permission",
      },
      {
        name: "Role",
        icon: "solar:user-check-rounded-outline",
        id: uniqueId(),
        url: "/admin/ui/role",
      },
      {
        name: "Form",
        icon: "solar:password-minimalistic-outline",
        id: uniqueId(),
        url: "/admin/ui/form",
      },
    ],
  },
];

export default SidebarContent;
