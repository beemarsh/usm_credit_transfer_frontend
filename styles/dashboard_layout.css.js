export const dashboard_layout_styles = {
  outer_box: { display: "flex" },
  left_box: { flexBasis: "30%" },
  right_box: { flexBasis: "70%", display: "flex", flexDirection: "column" },
  right_content_box: {
    flexGrow: 1,
    width: "100%",
  },
  desktop_paper: { border: 0, position: "relative" },
  desktop_drawer: {
    display: { xs: "none", sm: "block" },
    "& .MuiDrawer-paper": {
      boxSizing: "border-box",
    },
  },
  drawer_content: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  drawer_title: {
    textAlign: "center",
    fontSize: 20,
    whiteSpace: "pre-line",
  },
};
