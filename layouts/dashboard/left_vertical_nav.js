import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import UniLogo from "../../public/images/univ_logo.png";

import { drawerWidth, nav_links } from "./conf";
import Link from "next/link";
import { app_title } from "../../config/conf";

export default function CustomVerticalLeftNav({
  mobileOpen,
  handleDrawerToggle,
  ...props
}) {
  return (
    <Box>
      <MobileDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        {...props}
      />

      <DesktopDrawer {...props} />
    </Box>
  );
}

const MobileDrawer = ({ mobileOpen, handleDrawerToggle, window, ...props }) => {
  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <Drawer
      container={container}
      variant="temporary"
      open={mobileOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        display: { xs: "block", sm: "none" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: drawerWidth,
        },
      }}
    >
      <LeftDrawerMainContent {...props} />
    </Drawer>
  );
};

const DesktopDrawer = (props) => {
  return (
    <Drawer
      variant="permanent"
      elevation={0}
      PaperProps={{
        sx: { border: 0, position: "relative" },
      }}
      sx={{
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          // width: drawerWidth,
        },
      }}
      open
      anchor="left"
    >
      <LeftDrawerMainContent {...props} />
    </Drawer>
  );
};

const LeftDrawerMainContent = ({ isAdmin }) => (
  <div>
    <Box
      sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Box bgcolor="primary">
        <Image src={UniLogo} alt="Logo of the USM" width={120} height={120} />
      </Box>
      <Typography
        variant="h6"
        component="a"
        href="/"
        sx={{
          mr: 2,
          fontWeight: 700,
          //   letterSpacing: ".3rem",
          textDecoration: "none",
        }}
      >
        {app_title}
      </Typography>
    </Box>
    <List>
      {nav_links.map(({ Icon, link, title }) => {
        if (!isAdmin && link === "/admin") return null;
        return (
          <Link href={link} key={link}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
          </Link>
        );
      })}
    </List>
  </div>
);
