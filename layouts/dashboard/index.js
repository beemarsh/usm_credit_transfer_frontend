import { useState } from "react";
import { Box } from "@mui/material";
import DashBoardCustomNav from "./nav";

import { drawerWidth } from "./conf";
import CustomVerticalLeftNav from "./left_vertical_nav";

function DashBoardLayout({ children, user, ...props }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flexBasis: "30%" }}>
        {/* Left Nav or we can say Drawer */}
        <CustomVerticalLeftNav
          isAdmin={user?.is_admin}
          handleDrawerToggle={handleDrawerToggle}
          mobileOpen={mobileOpen}
        />
      </Box>

      <Box sx={{ flexBasis: "70%", display: "flex", flexDirection: "column" }}>
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
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default DashBoardLayout;
