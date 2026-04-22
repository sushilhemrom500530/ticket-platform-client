import {
  CircleQuestionMark,
  ShieldAlert,
  UserRound,
  Info,
} from "lucide-react";
import { TbMatrix } from "react-icons/tb";
import { Settings } from "lucide-react";
import {
  MdDashboardCustomize,
  MdOutlineLocalLibrary,
  MdOutlineDashboard,
} from "react-icons/md";
import { FaUsers } from "react-icons/fa6";
import { TbBulb } from "react-icons/tb";

export interface SubmenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

export interface MenuItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  submenu?: SubmenuItem[];
}

export interface MenuGroup {
  menu: MenuItem[];
}

export interface MenuData {
  linkData: MenuGroup[];
}

export const menuData: MenuData = {
  linkData: [
    {
      menu: [
        {
          label: "My Tickets",
          href: "/dashboard/tickets",
          icon: UserRound,
        },
        {
          label: "Overview",
          href: "/dashboard/overview",
          icon: MdOutlineDashboard,
        },
        {
          label: "Manage Events",
          href: "/dashboard/events",
          icon: MdDashboardCustomize,
        },
        {
          label: "Manage Categories",
          href: "/dashboard/categories",
          icon: TbMatrix,
        },
        {
          label: "Manage Tickets",
          href: "/dashboard/manage-tickets",
          icon: TbBulb,
        },
        {
          label: "Setting",
          icon: Settings,
          submenu: [
            {
              label: "Profile",
              href: "/dashboard/settings/profile",
              icon: UserRound,
            },
          ],
        },
      ],
    },
  ],
};
