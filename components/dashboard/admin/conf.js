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
} from "../../../config/icons";

export const admin_links = [
  {
    title: "Users",
    link: "/admin/users",
    Icon: Home,
    description: "View, edit and add a new user to enter data",
    LargeIcon: AddStudentIcon,
  },
  {
    title: "Schools",
    link: "/admin/schools",
    Icon: AddBox,
    description: "Add new schools",
    LargeIcon: AddStudentIcon,
  },
  {
    title: "Courses",
    link: "/admin/courses",
    Icon: Pending,
    description: "Access all the students that have pending transfer credits",
    LargeIcon: PendingIcon,
  },
  {
    title: "USM Departments",
    link: "/admin/usm_departments",
    Icon: AdminPanelSettings,
    description:
      "Change the settings like roles, access methods, departments and other highly critical information",
    LargeIcon: AdminPanelIcon,
  },
  {
    title: "USM Majors",
    link: "/admin/usm_majors",
    Icon: AdminPanelSettings,
    description:
      "Change the settings like roles, access methods, departments and other highly critical information",
    LargeIcon: AdminPanelIcon,
  },
  {
    title: "USM Courses",
    link: "/admin/usm_courses",
    Icon: AdminPanelSettings,
    description:
      "Change the settings like roles, access methods, departments and other highly critical information",
    LargeIcon: AdminPanelIcon,
  },
];
