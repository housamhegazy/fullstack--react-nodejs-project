//***********************ملاحظات هامه ********************** */
// نعتمد بشكل اساسي على الريأكت هوك لحماية المسارات
// ونعتمد بشكل اساسي على ملف authSlice  للتحقق من حالة المستخدم في كل انحاء التطبيق
//   (RTK Query)ونعتمد بشكل اساسي على useGetUserProfileQuery للحصول على بيانات المستخدم والتعديل عليها
//***********************ملاحظات هامه ********************** */

import { createBrowserRouter, RouterProvider } from "react-router-dom"; // <--- هذا هو الاستيراد الصحيح والوحيد لحزمة التوجيه
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Edite from "./pages/Edite";
import Search from "./pages/Search";
import View from "./pages/View";
import AddCustomer from "./pages/AddCustomer";
import Root from "./Root";
import Err_404Page from "./pages/Err_404Page";
import Signin from "./pages/signin";
import SignUp from "./pages/register";
// import AuthSuccess from "./components/AuthSuccess"; // أو المسار حسب مكان تخزينه
import AuthSuccess from './components/AuthSuccess'; // أو المسار حسب مكان تخزينه

import axios from "axios";
axios.defaults.withCredentials = true;
// <--- استيراد الـ loader الجديد
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingAuth, setAuthUser, clearAuthUser } from "./Redux/authSlice";
import { useGetUserProfileQuery } from "./Redux/userApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import { authLoader } from "./components/authLoader"; // استيراد الـ loader لصفحة تسجيل الدخول
import GoogleLogin from "./components/GoogleLogin";
function App() {
  const dispatch = useDispatch();

  // RTK Query hook لجلب بيانات الملف الشخصي للمستخدم
  // refetchOnMountOrArgChange: true يضمن إعادة جلب البيانات عند تحميل المكون أو تغيير الـ arguments
  // skip: false يضمن عدم تخطي الجلب
  const {
    data: userProfile,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  // useEffect لتحديث Redux authSlice بناءً على حالة جلب بيانات الملف الشخصي
//   useEffect(() => {
//   console.log('User Profile State:', {
//     isLoading,
//     isSuccess,
//     isError,
//     error: isError ? (typeof isError === 'object' ? isError.toString() : isError) : null,
//     userProfile,
//   });
//   dispatch(setLoadingAuth(isLoading));
//   if (!isLoading) {
//     if (isSuccess && userProfile) {
//       dispatch(setAuthUser(userProfile));
//     } else if (isError) {
//       console.log('Authentication error details:', isError);
//       dispatch(clearAuthUser());
//     }
//   }
// }, [userProfile, isLoading, isSuccess, isError, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      // errorElement: <Err_404Page />, // <--- يمكنك إضافة عنصر خطأ عام هنا إذا أردت
      children: [
        { index: true, Component: Home, loader: authLoader }, // <--- إضافة الـ loader هنا أيضًا
        { path: "profile", Component: Profile, loader: authLoader }, // <--- إضافة الـ loader هنا أيضًا
        // يمكنك أيضًا إضافة errorElement هنا لـ Profile إذا أردت معالجة الأخطاء الخاصة به
        { path: "edite/:id", Component: Edite, loader: authLoader },
        { path: "search", Component: Search, loader: authLoader },
        { path: "view/:id", Component: View, loader: authLoader },
        { path: "addCustomer", Component: AddCustomer, loader: authLoader }, // <--- إضافة الـ loader هنا أيضًا
        { path: "signin", Component: Signin }, // <--- إضافة الـ loader هنا أيضًا
        { path: "register", Component: SignUp }, // <--- إضافة الـ loader هنا أيضًا
        { path: "google-login", Component: GoogleLogin },
        { path: "auth-success", Component: AuthSuccess }, // إضافة مسار AuthSuccess هنا
        { path: "*", Component: Err_404Page },
      ],
    },
  ]);
  // <--- شاشة التحميل الأولية: تظهر أثناء التحقق من المصادقة الأولية
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default", // استخدام لون الخلفية من الثيم
          color: "text.primary", // استخدام لون النص من الثيم
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">جار التحقق من المصادقة...</Typography>
        <Typography variant="body2">يرجى الانتظار.</Typography>
      </Box>
    );
  }

  // بمجرد انتهاء التحميل الأولي، يتم عرض التطبيق بالكامل

  return <RouterProvider router={router} />;
}
export default App;
