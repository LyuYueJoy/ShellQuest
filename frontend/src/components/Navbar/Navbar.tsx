import { useState } from "react";
import {
  Container,
  Drawer,
  List,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import { useColorMode } from "../../ColorModeProvider";

import {
  BrandLink,
  BrandText,
  DesktopNavigation,
  DrawerContent,
  DrawerNavigationItem,
  DrawerTitle,
  MobileMenuButton,
  NavbarContainer,
  NavbarToolbar,
  NavigationLink,
  AuthenticationActions,
  DrawerAuthenticationActions,
  LoginActionLink,
  LogoutActionButton,
  RegisterActionLink,
  ColorModeButton,
  DrawerColorModeButton,
} from "./Navbar.styles";

interface NavigationItem {
  label: string;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", path: "/" },
  { label: "My Tortoises", path: "/tortoises" },
  { label: "Care Tasks", path: "/tasks" },
  { label: "Avatar Studio", path: "/avatar" },
  { label: "Shop", path: "/shop" },
  { label: "Forum", path: "/forum" },
  { label: "Chat", path: "/chat" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleColorMode } = useColorMode();
  const isLoggedIn = sessionStorage.getItem("shellQuestToken") !== null;
  const nextModeLabel = mode === "light" ? "dark" : "light";
  
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("shellQuestToken");
    sessionStorage.removeItem("shellQuestUser");

    setDrawerOpen(false);
    navigate("/forum", { replace: true });
  };

  return (
    <>
      <NavbarContainer elevation={0}>
        <Container maxWidth="xl">
          <NavbarToolbar disableGutters>
            <BrandLink to="/">
              <PetsIcon sx={{ color: "#D7B85C", fontSize: 34 }} />
              <BrandText variant="h5">ShellQuest</BrandText>
            </BrandLink>

            <DesktopNavigation role="navigation">
              {navigationItems.map((item) => (
                <NavigationLink
                  key={item.path}
                  to={item.path}
                  active={isActive(item.path)}
                >
                  {item.label}
                </NavigationLink>
              ))}
            </DesktopNavigation>

            <AuthenticationActions>
              <Tooltip title={`Switch to ${nextModeLabel} mode`} arrow>
                <ColorModeButton
                  type="button"
                  aria-label={`Switch to ${nextModeLabel} mode`}
                  onClick={toggleColorMode}
                >
                  {mode === "light" ? (
                    <DarkModeRoundedIcon />
                  ) : (
                    <LightModeRoundedIcon />
                  )}
                </ColorModeButton>
              </Tooltip>

              {isLoggedIn ? (
                <LogoutActionButton
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Log out
                </LogoutActionButton>
              ) : (
                <>
                  <LoginActionLink to="/login">
                    Log in
                  </LoginActionLink>

                  <RegisterActionLink to="/register">
                    Register
                  </RegisterActionLink>
                </>
              )}
            </AuthenticationActions>

            <Tooltip title={`Switch to ${nextModeLabel} mode`} arrow>
              <ColorModeButton
                type="button"
                mobile
                aria-label={`Switch to ${nextModeLabel} mode`}
                onClick={toggleColorMode}
              >
                {mode === "light" ? (
                  <DarkModeRoundedIcon />
                ) : (
                  <LightModeRoundedIcon />
                )}
              </ColorModeButton>
            </Tooltip>

            <MobileMenuButton
              aria-label="Open navigation menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </MobileMenuButton>
          </NavbarToolbar>
        </Container>
      </NavbarContainer>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
      >
        <DrawerContent>
          <DrawerTitle variant="h6">
            ShellQuest
          </DrawerTitle>

          <List component="nav" aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeDrawer}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <DrawerNavigationItem selected={isActive(item.path)}>
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: 800,
                      },
                    },
                  }}
                />
              </DrawerNavigationItem>
            </Link>
          ))}
          </List>

          <DrawerColorModeButton
            type="button"
            onClick={toggleColorMode}
            startIcon={
              mode === "light" ? (
                <DarkModeRoundedIcon />
              ) : (
                <LightModeRoundedIcon />
              )
            }
          >
            Switch to {nextModeLabel} mode
          </DrawerColorModeButton>

        <DrawerAuthenticationActions>
          {isLoggedIn ? (
            <LogoutActionButton
              type="button"
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Log out
            </LogoutActionButton>
          ) : (
            <>
              <LoginActionLink
                to="/login"
                onClick={closeDrawer}
              >
                Log in
              </LoginActionLink>

              <RegisterActionLink
                to="/register"
                onClick={closeDrawer}
              >
                Register
              </RegisterActionLink>
            </>
          )}
        </DrawerAuthenticationActions>
        </DrawerContent>
      </Drawer>
    </>
  );
}