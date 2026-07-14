import { Box, Typography } from "@mui/material";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";

function Page({ title }: { title: string }) {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Box component="main">
        <Routes>
          <Route path="/" element={<Page title="Dashboard" />} />
          <Route
            path="/tortoises"
            element={<Page title="My Tortoises" />}
          />
          <Route path="/tasks" element={<Page title="Care Tasks" />} />
          <Route
            path="/avatar"
            element={<Page title="Avatar Studio" />}
          />
          <Route path="/shop" element={<Page title="Shop" />} />
          <Route path="/forum" element={<Page title="Forum" />} />
          <Route path="/chat" element={<Page title="Private Chat" />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}