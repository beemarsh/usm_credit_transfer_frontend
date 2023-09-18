import { Box, TextField, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import UniversityLogo from "../public/images/univ_logo.png";
import { useState } from "react";
import { DEBUG, SERVER_URL } from "../config/conf";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useSnackbar } from "notistack";
import Loading from "./Loading";

export default function Login() {
  const [username, setUsername] = useState("admin@usm.edu");
  const [password, setPassword] = useState("admin123");

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async () => {
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

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      if (DEBUG) console.log(error);
      enqueueSnackbar({
        message: error?.message ? error?.message : "Sorry! Couldn't login",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: { xs: 200, sm: 300, md: 400, xl: 400 },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Image
          src={UniversityLogo}
          alt="Loog of the USM"
          width={200}
          height={200}
          // blurDataURL="data:..." automatically provided
          // placeholder="blur" // Optional blur-up while loading
        />
        <Box
          sx={{ display: "flex", gap: 4, flexDirection: "column" }}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(v) => setUsername(v.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(v) => setPassword(v.target.value)}
          />
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
