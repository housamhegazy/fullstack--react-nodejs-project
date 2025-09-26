
// استيراد مكونات MUI
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  CircularProgress, // لعرض رسائل الخطأ
} from "@mui/material";

// استيراد أيقونات MUI (تأكد من تثبيت @mui/icons-material)
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format, formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

// استيراد هوك RTK Query (إذا كنت تستخدمه)
// import { useGetUserProfileQuery } from "../Redux/userApi";
// import { useEffect } from "react";

const Profile = () => {
  // const navigate = useNavigate(); // تهيئة useNavigate
  // const { data: user, error, isLoading, isSuccess } = useGetUserProfileQuery();
  //هنا انا استخدمت ال loader عشان احصل على بيانات المستخدم لكن لو هعمل تحديث بيانات المستخدم في الملف الشخصي ممكن استخدم useGetUserProfileQuery
  // const user = useLoaderData();
  // @ts-ignore
  const authState = useSelector((state) => state.auth);
  const user = authState?.user; // <--- هنا بيانات المستخدم!
  // جلب حالة المصادقة وحالة التحميل الأولية من Redux Store
  // const isAuthenticated = authState?.isAuthenticated;
  //
      const isLoadingAuth = authState?.isLoadingAuth; // حالة التحقق الأولي من المصادقة
// const { user, isAuthenticated, isLoadingAuth } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   if (error && error.status === 401) {
  //     navigate('/signin', { replace: true, state: { message: 'الرجاء تسجيل الدخول لعرض ملفك الشخصي.' } });
  //   }
  // }, [ navigate, error]);

  // if (isLoading) {
  //   return (
  //     <Container
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         minHeight: "80vh",
  //       }}
  //     >
  //       <CircularProgress />
  //       <Typography variant="h6" sx={{ ml: 2 }}>
  //         loading profile information...
  //       </Typography>
  //     </Container>
  //   );
  // }


  // // إذا كان هناك خطأ ولكن ليس 401 (لأنه تم التعامل معه في useEffect)
  // if (error) {
  //   let errorMessage = "حدث خطأ غير متوقع.";
  //   if (error.data && typeof error.data === 'object' && error.data.message) {
  //     errorMessage = error.data.message;
  //   } else {
  //     errorMessage = JSON.stringify(error);
  //   }
  //   return (
  //     <Container maxWidth="sm" sx={{ mt: 4 }}>
  //       <Alert severity="error">
  //         <Typography variant="h6">خطأ في جلب بيانات الملف الشخصي:</Typography>
  //         <Typography>{errorMessage}</Typography>
  //       </Alert>
  //     </Container>
  //   );
  // }

  // إذا لم يكن هناك مستخدم بعد التحميل وعدم وجود أخطاء
  if (isLoadingAuth) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default", // استخدام لون الخلفية من الثيم
          color: "text.primary",         // استخدام لون النص من الثيم
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">جار التحقق من المصادقة...</Typography>
        <Typography variant="body2">يرجى الانتظار.</Typography>
      </Box>
    );
  }

if(user){
    return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{ width: 100, height: 100, bgcolor: "primary.main", mb: 2 }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ color: "inherit" }}
          >
            {user.fullName || "الاسم غير متوفر"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ID: {user._id}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <List>
          <ListItem>
            <ListItemIcon>
              <EmailIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="email "
              secondary={user.email || "unavailable"}
            />
          </ListItem>
          <Divider variant="inset" component="li" /> {/* خط فاصل تحت كل عنصر */}
          <ListItem>
            <ListItemIcon>
              <CalendarTodayIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="تاريخ التسجيل"
              secondary={format(new Date(user.createdAt), "PP")}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <AccessTimeIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary="آخر تسجيل دخول"
              secondary={formatDistanceToNow(new Date(user.lastLogin), { addSuffix: true })}
            />
          </ListItem>
          {/* يمكنك إضافة المزيد من الحقول هنا */}
          {user.role && ( // مثال: عرض الدور إذا كان موجودًا
            <>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="action" />
                </ListItemIcon>
                <ListItemText primary="الدور" secondary={user.role} />
              </ListItem>
            </>
          )}
        </List>
      </Paper>
    </Container>
  );
}
};

export default Profile;
