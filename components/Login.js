import { Box, TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import UniversityLogo from "../public/images/univ_logo.png";
import { useState } from "react";
import { APP_TITLE, DEBUG, SERVER_URL } from "../config/conf";
import { useSnackbar } from "notistack";
import { login_style } from "../styles/login.css";

export default function Login() {
  // States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fetching, setFetching] = useState(false);

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async () => {
    // Before sending request, set fetching on, so all the buttons and text inputs are disabled
    setFetching(true);
    try {
      const re = await fetch(`${SERVER_URL}/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          email: username,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!re.ok) throw await re.json();

      setFetching(false);
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message ? error?.message : "Sorry! Couldn't login",
      });
    }
    setFetching(false);
  };

  return (
    <Box sx={login_style.outer_box}>
      <Box sx={login_style.inner_box}>
        {/* Uni Logo */}
        <Box sx={login_style.uni_logo_box}>
          <Image
            src={UniversityLogo}
            alt="Logo of USM"
            width={200}
            height={200}
          />
        </Box>

        {/* Title */}

        <Typography variant="h5" sx={login_style.title}>
          {APP_TITLE}
        </Typography>

        {/* Login Form  */}
        <Box
          sx={login_style.form_box}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* Email Input */}
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={username}
            onChange={(v) => setUsername(v.target.value)}
            disabled={fetching}
            type="email"
          />

          {/* Password Input */}
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(v) => setPassword(v.target.value)}
            disabled={fetching}
          />

          {/* Submit Button */}
          <Button
            variant="contained"
            type="submit"
            disabled={fetching}
            sx={login_style.submit_button}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
