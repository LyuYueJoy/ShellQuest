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
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import MyTortoisesPage from "./pages/MyTortoisesPage/MyTortoisesPage";
import AddTortoisePage from "./pages/AddTortoisePage/AddTortoisePage";
import TortoiseDetailPage from "./pages/TortoiseDetailPage/TortoiseDetailPage";
import EditTortoisePage from "./pages/EditTortoisePage/EditTortoisePage";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import CareTasksPage from "./pages/CareTasksPage/CareTasksPage";
import ShopPage from "./pages/ShopPage/ShopPage";
import AvatarStudioPage from "./pages/AvatarStudioPage/AvatarStudioPage";


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
        {/* Application pages: these use AppLayout and Navbar. */}
        <Route element={<AppLayout />}>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forum" element={<Page title="Forum" />} />

          {/* Login-required routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />

            <Route
              path="/tortoises"
              element={<MyTortoisesPage/>}
            />

            <Route
              path="/tortoises/new"
              element={<AddTortoisePage />}
            />
            <Route
              path="/tortoises/:tortoiseId/edit"
              element={<EditTortoisePage />}
            />


            <Route
              path="/tortoises/:tortoiseId"
              element={<TortoiseDetailPage />}
            />

            <Route
              path="/tasks"
              element={<CareTasksPage />}
            />

            <Route
              path="/avatar"
              element={<AvatarStudioPage />}
            />

            <Route path="/shop" element={<ShopPage />} />

            <Route
              path="/chat"
              element={<Page title="Private Chat" />}
            />

            <Route
              path="*"
              element={<Navigate to="/forum" replace />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}