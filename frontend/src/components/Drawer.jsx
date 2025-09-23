import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { DarkMode, GroupAdd, Logout, Settings, Sunny } from "@mui/icons-material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import { useLocation, useNavigate } from "react-router";

function ResponsiveDrawer({
  handleDrawerClose,
  handleDrawerTransitionEnd,
  mobileOpen,
  drawerWidth,
  theme,
  handleTheme,
}) {
  const location = useLocation();
  const iconColor = theme.palette.mode === "dark" ? "inherit" : "primary";
  const navigate = useNavigate();
  //list items data
  const myList = [
    {
      title: "profile",
      icon: <AccountBoxIcon color={iconColor} />,
      pathname: "/profile",
    },
    {
      title: "home",
      icon: <HomeIcon color={iconColor} />,
      pathname: "/",
    },
    {
      title: "Add Customer",
      icon: <GroupAdd color={iconColor} />,
      pathname: "/addCustomer",
    },
    {
      title: "settings",
      icon: <Settings color={iconColor} />,
      pathname: "/settings",
    },
  ];

  //drawer content
  const drawer = (
    <div>
      <Toolbar />
      <IconButton
        onClick={handleTheme}
        sx={{ mx: "auto", display: "block" }}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? <Sunny /> : <DarkMode />}
      </IconButton>
      <Divider />
      <List>
        {myList.map((item, index) => {
          return (
            <ListItem
              sx={{
                backgroundColor:
                  location.pathname === item.pathname
                    ? theme.palette.action.selected
                    : "inherit",
              }}
              key={index}
              onClick={() => {
                navigate(item.pathname);
                handleDrawerClose()
              }}
              disablePadding
            >
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          );
        })}
        <ListItem sx={{ mt: 5, px: 0 }}>
          <ListItemButton>
            <ListItemIcon>
              <Logout color={"error"} />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: "red" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: `${drawerWidth}px` }, flexShrink: { sm: 0 } }}
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen} // Mobile drawer open state
        onTransitionEnd={handleDrawerTransitionEnd} // Handle transition end
        onClose={handleDrawerClose} // close drawer when press on any place outside drawer
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default ResponsiveDrawer;
