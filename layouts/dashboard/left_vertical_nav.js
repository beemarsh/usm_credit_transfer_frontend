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
import Link from "next/link";

import { drawerWidth, nav_links } from "./conf";
import UniLogo from "../../public/images/univ_logo.png";
import { APP_TITLE } from "../../config/conf";
import { dashboard_layout_styles } from "../../styles/dashboard_layout.css.js";

export default function CustomVerticalLeftNav({
  mobileOpen,
  handleDrawerToggle,
  ...props
}) {
  return (
    <Box>
      {/* Mobile only opens when the screen size is below a threshold */}
      <MobileDrawer
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        {...props}
      />

      {/* It is only shown when screen size is above the threshold */}
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
        sx: dashboard_layout_styles.desktop_paper,
      }}
      sx={dashboard_layout_styles.desktop_drawer}
      open
      anchor="left"
    >
      <LeftDrawerMainContent {...props} />
    </Drawer>
  );
};

const LeftDrawerMainContent = ({ isAdmin }) => (
  <div>
    <Box sx={dashboard_layout_styles.drawer_content}>
      <Box bgcolor="primary">
        <Image src={UniLogo} alt="Logo of USM" width={120} height={120} />
      </Box>
      <Typography
        variant="h6"
        sx={dashboard_layout_styles.drawer_title}
      >
        {APP_TITLE}
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
