import { useState } from "react";
import { Box } from "@mui/material";
import DashBoardCustomNav from "./nav";
import CustomVerticalLeftNav from "./left_vertical_nav";
import { dashboard_layout_styles } from "../../styles/dashboard_layout.css";

function DashBoardLayout({ children, user, ...props }) {
  //States
  //Drawer opens on the left of mobile screens
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  //To open usermenu
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  //To handle
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  //To close or open the drawer in mobile phone
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={dashboard_layout_styles.outer_box}>
      {/* Left Drawer in Mobile and List in Desktop */}
      <Box sx={dashboard_layout_styles.left_box}>
        <CustomVerticalLeftNav
          isAdmin={user?.is_admin}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
      </Box>

      {/* Right Bar that contains Navbar and Contents Container */}
      <Box sx={dashboard_layout_styles.right_box}>
        {/* Drawer Top Nav with Title and User Settings */}
        <DashBoardCustomNav
          profilePic={user?.profile_picture}
          first_name={user?.first_name}
          anchorElUser={anchorElUser}
          handleCloseUserMenu={handleCloseUserMenu}
          handleDrawerToggle={handleDrawerToggle}
          handleOpenUserMenu={handleOpenUserMenu}
        />

        {/* All the Contents of the Page goes Here */}
        <Box component="main" sx={dashboard_layout_styles.right_content_box}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default DashBoardLayout;
