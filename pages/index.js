import { Box, Button, Typography } from "@mui/material";
import { UniversityLogo } from "../config/icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { index_page_styles } from "../styles/index_page.css";
import {
  Mail as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
// import { Link } from "@mui/material";
import Link from "next/link";
import { APP_TITLE } from "../config/conf";

export default function Home() {
  const [imageSize, setImageSize] = useState({ width: 200, height: 200 });
  useEffect(() => {
    // To change the size of the University Image Logo because I cannot statically change next images
    const handleImageSize = () => {
      const windowWidth = window.innerWidth;
      let width, height;

      if (windowWidth < 600) {
        width = 200;
        height = 200;
      } else if (windowWidth < 1200) {
        width = 200;
        height = 200;
      } else if (windowWidth < 1535) {
        width = 300;
        height = 300;
      } else {
        width = 400;
        height = 400;
      }
      return { width: width, height: height };
    };
    setImageSize({ ...handleImageSize() });
  }, []);

  return (
    <Box sx={index_page_styles.container}>
      <Box sx={index_page_styles.content}>
        {/* Page Title */}
        <Typography variant="h2" sx={index_page_styles.title}>
          {APP_TITLE}
        </Typography>

        {/*  Login Button*/}
        <Link href="/login" style={index_page_styles.buttonLink}>
          <Button
            variant="contained"
            disableRipple
            sx={index_page_styles.button}
          >
            Login
          </Button>
        </Link>

        {/* Request Access BUtton */}
        <Link href="/request_access" style={index_page_styles.buttonLink}>
          <Button
            variant="outlined"
            disableRipple
            sx={index_page_styles.button}
          >
            Request Access
          </Button>
        </Link>
      </Box>

      {/* Logo Content Here */}
      <Box sx={index_page_styles.noncontent}>
        <Box sx={index_page_styles.imageContainer}>
          <Image
            src={UniversityLogo}
            alt="University of Southern Miss Logo"
            height={imageSize.height}
            width={imageSize.width}
            placeholder="blur" // Show a blurred placeholder
          />
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={index_page_styles.footerContainer}>
        {/* Icons Links */}
        <Box sx={index_page_styles.iconsContainer}>
          {/* Github Link */}
          <Link
            href="https://github.com/beemarsh"
            underline="hover"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon sx={index_page_styles.icons} />
          </Link>

          {/* Linkedin Link */}
          <Link
            href="https://www.linkedin.com/in/bimarsh-bhusal"
            underline="hover"
            target="_blank"
            rel="noreferrer"
          >
            <LinkedInIcon sx={index_page_styles.icons} />
          </Link>

          {/* Email Link */}
          <Link
            href="mailto:career.bimarsh@gmail.com"
            underline="hover"
            target="_blank"
            rel="noreferrer"
          >
            <EmailIcon sx={index_page_styles.icons} />
          </Link>
        </Box>

        {/* Personal Portfolio and Desined by Link */}
        <Box sx={index_page_styles.designerContainer}>
          <Typography sx={index_page_styles.designerText} variant="subtitle2">
            {"Designed by:   "}
            <Link
              href="https://bimarshbhusal.com.np"
              underline="hover"
              target="_blank"
              rel="noreferrer"
              style={index_page_styles.designerText}
            >
              Bimarsh Bhusal
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
