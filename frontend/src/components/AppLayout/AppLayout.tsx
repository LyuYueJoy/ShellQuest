import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../Navbar/Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />

      <Box component="main">
        <Outlet />
      </Box>
    </>
  );
}