import React from "react";
import "../styles/index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffd046",
    },
    secondary: {
      main: "#000",
    },
  },
});

function CreditApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <SnackbarProvider autoHideDuration={4000}>
          <Component {...pageProps} />
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default CreditApp;
