import ApiUser from "../../../api/ApiUser";
import "./index.scss";
import IconDropDown from "@app/public/icon/IconDropDown";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import routes, {ExtendedRoute} from "@app/routes/RouteList";
import {IAccountRole} from "@app/types";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useEffect, useMemo, useState} from "react";

const drawerWidth = 240;

// Define the menu item interface
interface MenuItem {
  key: string;
  title: string;
  label: string;
  icon?: React.ReactElement;
  iconActive?: React.ReactElement;
  isHeader?: boolean;
  children?: {
    key: string;
    title: string;
    label: string;
    icon?: React.ReactElement;
    path: string;
  }[];
}

const RenderMenu = React.memo(() => {
  const router = useRouter();
  const userRole = ApiUser.getUserRole();
  const [open, setOpen] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Initialize open state for the current path
    const currentMainPath = "/" + router.pathname.split("/")[1];
    const shouldBeOpen = routes.find(
      (route: ExtendedRoute) =>
        route.path === currentMainPath && route.children,
    );

    if (shouldBeOpen) {
      setOpen((prev) => ({...prev, [shouldBeOpen.path]: true}));
    }
  }, [router.pathname]);

  const handleClick = (path: string) => {
    setOpen((prev) => ({...prev, [path]: !prev[path]}));
  };

  const menuItems = useMemo<MenuItem[]>(() => {
    return routes
      .filter(
        ({role}: any) =>
          !(role && userRole ? !role?.includes(userRole) : undefined),
      )
      .map(({path, name, children, icon, isHeader, iconActive}: any) => {
        if (isHeader) {
          return {
            key: path,
            title: name,
            label: name,
            icon: icon,
            iconActive: iconActive,
            isHeader: true,
          };
        }
        if (children) {
          return {
            key: path,
            title: name,
            label: name,
            icon: icon,
            iconActive: iconActive,
            children: children
              .filter(
                (child: any) =>
                  !child.role?.includes(userRole ?? IAccountRole.ANONYMOUS),
              )
              .map((child: any) => ({
                key: path + child.path,
                title: child.name,
                label: child.name,
                icon: child.icon,
                path: child.path,
              })),
          };
        }
        return {
          key: path,
          title: name,
          label: name,
          icon: icon,
          iconActive: iconActive,
        };
      });
  }, [userRole]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    // Special case for root path
    if (path === "/") {
      return router.pathname === "/" || router.pathname === "/dashboard";
    }
    return router.pathname === path || router.pathname.startsWith(path);
  };

  const renderMenuItems = () => {
    return menuItems.map((item) => {
      // Check if this item or any of its children is active
      const hasActiveChild =
        item.children?.some((child) => {
          const childPath = item.key + child.path;
          return (
            router.pathname === childPath ||
            router.pathname.startsWith(childPath)
          );
        }) || false;

      const isItemActive = isActive(item.key) || hasActiveChild;

      return (
        <React.Fragment key={item.key}>
          {item.isHeader ? (
            <Typography
              variant="subtitle2"
              className="menu-header"
              sx={{
                px: 2,
                pt: 2,
                pb: 1,
                fontWeight: 600,
                color: "#637381",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            >
              {item.title}
            </Typography>
          ) : (
            <ListItem
              disablePadding
              className={isItemActive ? "bg-[#734DBE14] rounded" : ""}
            >
              <ListItemButton
                onClick={() => {
                  if (item.children) {
                    handleClick(item.key);
                    // Auto-open parent when clicked
                    if (!open[item.key]) {
                      setOpen((prev) => ({...prev, [item.key]: true}));
                    }
                  } else {
                    handleNavigation(item.key);
                  }
                }}
                className={`${isItemActive ? "active" : ""} ${
                  item.children && open[item.key] ? "submenu-open" : ""
                }`}
                sx={{
                  pl: 2,
                  pr: 1,
                  py: 1,
                  minHeight: 48,
                }}
              >
                {item.icon && (
                  <ListItemIcon
                    className={isItemActive ? "active" : ""}
                    sx={{minWidth: 40}}
                  >
                    {isItemActive ? item.iconActive : item.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  className={isItemActive ? "text-[#734DBE]" : "text-[#637381]"}
                  primary={item.title}
                />
                {item.children &&
                  (open[item.key] ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
            </ListItem>
          )}
          {item.children && (
            <Collapse in={open[item.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map((child) => {
                  const childPath = item.key + child.path;
                  const isChildActive =
                    router.pathname === childPath ||
                    router.pathname.startsWith(childPath);

                  return (
                    <ListItemButton
                      key={childPath}
                      sx={{
                        pl: 6,
                        py: 0.75,
                        minHeight: 38,
                        position: "relative",
                      }}
                      onClick={() => handleNavigation(childPath)}
                      className={isChildActive ? "active" : ""}
                    >
                      {isChildActive && (
                        <Box
                          className="active-indicator"
                          sx={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "#7E3AF2",
                          }}
                        />
                      )}
                      <ListItemText
                        primary={child.title}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: isChildActive ? 600 : 400,
                          color: isChildActive ? "#212B36" : "#637381",
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return <List sx={{p: 0}}>{renderMenuItems()}</List>;
});
RenderMenu.displayName = "RenderMenu";

export default function Sidebar(): JSX.Element {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const drawer = (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
          <Image src="/img/logo-2.png" alt="logo" width={40} height={40} />
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <IconDropDown />
        </IconButton>
      </Box>
      <RenderMenu />
    </>
  );

  return (
    <>
      {/* Toggle button that appears when sidebar is closed */}
      {!open && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            "position": "fixed",
            "top": "10px",
            "left": "10px",
            "zIndex": 1200,
            "&:hover": {
              backgroundColor: "#FFFAF0",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Box
        component="nav"
        sx={{width: {sm: open ? drawerWidth : 0}, flexShrink: {sm: 0}}}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="persistent"
            open={open}
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>
    </>
  );
}
