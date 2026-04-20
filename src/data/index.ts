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
          label: "Dashboard",
          href: "/dashboard",
          icon: MdOutlineDashboard,
        },
        {
          label: "User Management",
          href: "/dashboard/user-manage",
          icon: FaUsers,
        },
        {
          label: "Resource Library",
          href: "/dashboard/resource-library",
          icon: MdOutlineLocalLibrary,
        },
        {
          label: "Challenge Matrix",
          href: "/dashboard/challenge-matrix",
          icon: TbMatrix,
        },

        {
          label: "Content Moderation",
          href: "/dashboard/content-moderation",
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
            {
              label: "Terms & Service",
              href: "/dashboard/settings/terms-service",
              icon: Info,
            },
            {
              label: "Privacy Policy",
              href: "/dashboard/settings/privacy-policy",
              icon: ShieldAlert,
            },
            {
              label: "About Us",
              href: "/dashboard/settings/about-us",
              icon: CircleQuestionMark,
            },
          ],
        },
      ],
    },
  ],
};
