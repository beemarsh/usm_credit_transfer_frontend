import {
  Home,
  Pending,
  AddBox,
  AdminPanelSettings,
  Person,
  ManageAccounts,
  PowerSettingsNew,
} from "@mui/icons-material";
import {
  AddStudentIcon,
  AdminPanelIcon,
  PendingIcon,
} from "../../config/icons";

export const drawerWidth = 240;

export const settings = [
  {
    title: "Profile",
    link: "/profile",
    Icon: Person,
  },
  {
    title: "Account Settings",
    link: "/settings",
    Icon: ManageAccounts,
  },
  {
    title: "Logout",
    link: "/logout",
    Icon: PowerSettingsNew,
  },
];

export const nav_links = [
  {
    title: "Home",
    link: "/dashboard",
    Icon: Home,
    description: "Displays all",
  },
  {
    title: "Add Student",
    link: "/add",
    Icon: AddBox,
    description: "Add new students to that database for configuration",
    LargeIcon: AddStudentIcon,
  },
  {
    title: "Pending Activities",
    link: "/activities",
    Icon: Pending,
    description: "Access all the students that have pending transfer credits",
    LargeIcon: PendingIcon,
  },
  {
    title: "Admin Panel",
    link: "/admin",
    Icon: AdminPanelSettings,
    description:
      "Change the settings like roles, access methods, departments and other highly critical information",
    LargeIcon: AdminPanelIcon,
  },
];
