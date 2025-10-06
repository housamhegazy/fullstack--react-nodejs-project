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
  CircularProgress, // لعرض رسائل الخطأ
} from "@mui/material";

// استيراد أيقونات MUI (تأكد من تثبيت @mui/icons-material)
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { format, formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // @ts-ignore
  const authState = useSelector((state) => state.auth);
  const user = authState?.user; // <--- هنا بيانات المستخدم!
  // const isLoadingAuth = authState?.isLoadingAuth; // حالة التحقق الأولي من المصادقة

  // إذا لم يكن هناك مستخدم بعد التحميل وعدم وجود أخطاء
const navigate = useNavigate()
useEffect(()=>{
  if(!user){
    navigate("/signin",{ replace: true })
  }
},[navigate, user])
  if (user) {
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
              alt={user?user.fullName:""}
            src= {user? user.avatar? user.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" :""}
    
            >
              
              
            </Avatar>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ color: "inherit" }}
            >
              {user.fullName || " unavaliable"}
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
            <Divider variant="inset" component="li" />{" "}
            {/* خط فاصل تحت كل عنصر */}
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
                secondary={formatDistanceToNow(new Date(user.lastLogin), {
                  addSuffix: true,
                })}
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
