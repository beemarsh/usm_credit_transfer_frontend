import {
  Box,
  IconButton,
  Typography,
  AppBar,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { drawerWidth, settings, nav_links } from "./conf";
import { app_title, DEBUG, SERVER_URL } from "../../config/conf";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useSnackbar } from "notistack";

const DashBoardCustomNav = ({
  handleDrawerToggle,
  handleOpenUserMenu,
  anchorElUser,
  handleCloseUserMenu,
  profilePic,
  first_name,
}) => {
  const [currTitle, setCurrTitle] = useState(app_title);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const logout_func = async () => {
    try {
      const re = await fetch(`${SERVER_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!re.ok) throw await re.json();

      // Redirect to dashboard
      router.push("/login");
    } catch (error) {
      if (DEBUG) {
        console.log(error);
      }
      enqueueSnackbar({
        message: error?.message ? error?.message : "Sorry! Couldn't logout",
      });
    }
  };

  useEffect(() => {
    setCurrTitle(getPageTitle(router.pathname));
  }, []);

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        width: "100%",
        height: "100px",
      }}
    >
      {/* Change the Title of the Page */}

      <Head>
        <title>
          {app_title !== currTitle ? `${currTitle} | ${app_title}` : app_title}
        </title>
      </Head>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "80px",
          alignItems: "flex-end",
        }}
      >
        <IconButton
          color="inherit"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          {currTitle}
        </Typography>

        {/* Profile Menu Icon */}
        <Box>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar alt={first_name} src={profilePic} />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map(({ Icon, title, link }, i) =>
              link === "/logout" ? (
                <MenuItem onClick={logout_func} key={link}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <Typography textAlign="center">{title}</Typography>
                </MenuItem>
              ) : (
                <Link key={link} href={link}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <Icon />
                    </ListItemIcon>
                    <Typography textAlign="center">{title}</Typography>
                  </MenuItem>
                </Link>
              )
            )}
          </Menu>
        </Box>
      </Box>
    </AppBar>
  );
};

const getPageTitle = (path) => {
  const item = nav_links.find((item) => item.link === path);
  return item ? item.title : app_title;
};
export default DashBoardCustomNav;
