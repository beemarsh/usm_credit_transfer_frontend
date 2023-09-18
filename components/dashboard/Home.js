import {
  Card,
  CardContent,
  Box,
  Typography,
  CardMedia,
  CardActionArea,
} from "@mui/material";

import { nav_links } from "../../layouts/dashboard/conf";
import Image from "next/image";
import Link from "next/link";

export default function DashBoardHome({ user }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        mt: 10,
      }}
    >
      {nav_links.map(({ title, link, description, LargeIcon }) => {
        if (link === "/dashboard") return null;
        else
          return (
            <Card
              sx={{
                flex: 1,
                flexBasis: "300px",
                margin: "10px",
                maxWidth: "300px",
              }}
              key={link}
              elevation={0}
            >
              <Link href={link}>
                <CardActionArea>
                  <Image src={LargeIcon} width={150} height={150} alt={title} />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          );
      })}
    </Box>
  );
}
