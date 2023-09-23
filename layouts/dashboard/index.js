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

        {/* <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.default",
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
            dolor purus non enim praesent elementum facilisis leo vel. Risus at
            ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
            rutrum quisque non tellus. Convallis convallis tellus id interdum
            velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
            sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
            integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
            eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
            quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at
            consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
            donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
            ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
            elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
            volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
            Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit
            gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
            aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
            euismod elementum nisi quis eleifend. Commodo viverra maecenas
            accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
            ultrices sagittis orci a.
          </Typography>
        </Box> */}
      </Box>
    </Box>
  );
}

export default DashBoardLayout;