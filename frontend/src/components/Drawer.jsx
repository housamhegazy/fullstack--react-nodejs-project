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
import {
  DarkMode,
  GroupAdd,
  Logout,
  Settings,
  Sunny,
} from "@mui/icons-material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import { Link, useLocation, useNavigate } from "react-router";
import { useSignOutMutation } from "../Redux/userApi";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthUser } from "../Redux/authSlice";

function ResponsiveDrawer({
  handleDrawerClose,
  handleDrawerTransitionEnd,
  mobileOpen,
  drawerWidth,
  theme,
  handleTheme,
}) {
  // const { data: user, error, isLoading, isSuccess } = useGetUserProfileQuery();
  //هنا انا استخدمت ال loader عشان احصل على بيانات المستخدم لكن لو هعمل تحديث بيانات المستخدم في الملف الشخصي ممكن استخدم useGetUserProfileQuery
  // const user = useLoaderData();
  // @ts-ignore
  const authState = useSelector((state) => state.auth);
  const user = authState?.user; // <--- هنا بيانات المستخدم!
  // جلب حالة المصادقة وحالة التحميل الأولية من Redux Store
  const isAuthenticated = authState?.isAuthenticated;
  const isLoadingAuth = authState?.isLoadingAuth; // حالة التحقق الأولي من المصادقة
  const [triggerSignOut, { isLoading: isSigningOut }] = useSignOutMutation();
  //=================================================================================
  //=================================================================================
  const location = useLocation();
  const iconColor = theme.palette.mode === "dark" ? "inherit" : "primary";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log('User data in Drawer:', user); // تحقق من بيانات المستخدم هنا
  //list items data
  const myList = [
    {
      title: "profile",
      icon: <AccountBoxIcon color={iconColor} />,
      pathname: "/profile",
    },
    {
      title: "Customers",
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
  const handleLogout = async () => {
    try {
      // استدعاء الـ mutation لتسجيل الخروج. .unwrap() يرمي خطأ إذا فشل الطلب
      await triggerSignOut().unwrap();
      dispatch(clearAuthUser()); // <--- مسح حالة المستخدم من Redux Store
      navigate("/signin", { replace: true }); // <--- إعادة التوجيه إلى صفحة تسجيل الدخول
      handleDrawerClose(); // إغلاق الـ drawer بعد تسجيل الخروج
    } catch (error) {
      console.error("Error during logout:", error);
      // يمكنك هنا إضافة منطق لعرض رسالة خطأ للمستخدم إذا فشل تسجيل الخروج
    }

    //old code
    // // إرسال طلب تسجيل الخروج إلى الخادم
    // try {
    //   const response = await fetch("http://localhost:3000/api/signout", {
    //     method: "POST",
    //     credentials: "include", // تأكد من تضمين الكوكيز
    //   });
    //   if (response.ok) {
    //     // تسجيل الخروج ناجح، قم بإعادة التوجيه إلى صفحة تسجيل الدخول أو الصفحة الرئيسية
    //     navigate("/signin"); // أو أي مسار آخر ترغب في التوجيه إليه بعد تسجيل الخروج
    //   } else {
    //     console.error("Failed to log out");
    //   }
    // } catch (error) {
    //   console.error("Error during logout:", error);
    // }
  };
  //drawer content
  const drawer = (
    <div>
      <Box sx={{height:"80px",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Link
          to="/"
          // underline="none"
          style={{
            height:"100%",
            fontSize: "1rem",
            color: "white",
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
          }}
        >
          Customer Dashboard
        </Link>
      </Box>
          <Divider/>
      {/* <Toolbar /> */}
      <IconButton
        onClick={handleTheme}
        sx={{ mx: "auto", display: "block" }}
        color="inherit"
      >
        {theme.palette.mode === "dark" ? <Sunny /> : <DarkMode />}
      </IconButton>
      <List>
        <Divider />
        {isLoadingAuth && (
          <ListItem
            sx={{ mt: 2, mb: 1, flexDirection: "column", alignItems: "center" }}
          >
            <ListItemText primary="Loading..." />
          </ListItem>
        )}
        
        {isAuthenticated && (
          <>
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
                    handleDrawerClose();
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
            <ListItem onClick={handleLogout} sx={{ mt: 5, px: 0 }}>
              <ListItemButton>
                <ListItemIcon>
                  <Logout color={"error"} />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ color: "red" }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
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
