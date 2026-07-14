import { useState } from "react";
import { Container, Drawer, List, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PetsIcon from "@mui/icons-material/Pets";

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
  UserAvatar,
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

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
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

            <UserAvatar>J</UserAvatar>

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
        </DrawerContent>
      </Drawer>
    </>
  );
}