export const index_page_styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    background: "#000",
    flexDirection: {
      xs: "column-reverse",
      lg: "row",
    },
  },
  content: {
    flex: { xs: 3, lg: 1 },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "30px",
    justifyContent: { xs: "flex-start", md: "center" },
    marginTop: { xs: "40px", md: 0 },
  },
  title: {
    fontSize: {
      xs: "2rem",
      md: "3rem",
      lg: "3.75rem",
    },
    textAlign: "center",
    color: "#fff",
  },
  button: { width: { xs: "90%", sm: 300, md: 400 }, height: 55 },

  noncontent: {
    flex: { xs: 2, lg: 1 },
    display: "flex",
    flexDirection: { xs: "column", lg: "row" },
    alignItems: "center",
    justifyContent: { xs: "flex-end", lg: "center" },
  },
  imageContainer: {
    height: { xs: 250, lg: 400, xl: 600 },
    width: { xs: 250, lg: 400, xl: 600 },
    background: "#ffd046",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "100%",
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "#08070c",
    //   height:"50px"
    py: "20px",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  iconsContainer: { display: "flex", gap: "10px" },
  icons: {
    color: "#59585b",
    "&:hover": {
      color: "#ccc ",
    },
  },
  designerContainer:{ position: "absolute", right: 10 },
  designerText:{ color: "#666" }
};
