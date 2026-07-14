import { Box, Typography } from "@mui/material";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout/AppLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";

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
      <Routes>
        {/* Public pages: these do not display the Navbar. */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Application pages: these use AppLayout and Navbar. */}
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Page title="Dashboard" />}
          />

          <Route
            path="/tortoises"
            element={<Page title="My Tortoises" />}
          />

          <Route
            path="/tasks"
            element={<Page title="Care Tasks" />}
          />

          <Route
            path="/avatar"
            element={<Page title="Avatar Studio" />}
          />

          <Route
            path="/shop"
            element={<Page title="Shop" />}
          />

          <Route
            path="/forum"
            element={<Page title="Forum" />}
          />

          <Route
            path="/chat"
            element={<Page title="Private Chat" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}