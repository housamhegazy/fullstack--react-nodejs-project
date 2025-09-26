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

import axios from "axios";
axios.defaults.withCredentials = true;
// <--- استيراد الـ loader الجديد
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingAuth, setAuthUser, clearAuthUser } from "./Redux/authSlice";
import { useGetUserProfileQuery } from "./Redux/userApi";
import { Box, CircularProgress, Typography } from "@mui/material";
import {authLoader} from "./components/authLoader"; // استيراد الـ loader لصفحة تسجيل الدخول
function App() {

  const dispatch = useDispatch();

  // RTK Query hook لجلب بيانات الملف الشخصي للمستخدم
  // refetchOnMountOrArgChange: true يضمن إعادة جلب البيانات عند تحميل المكون أو تغيير الـ arguments
  // skip: false يضمن عدم تخطي الجلب
  const { data: userProfile, isLoading, isSuccess, isError } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  // useEffect لتحديث Redux authSlice بناءً على حالة جلب بيانات الملف الشخصي
  useEffect(() => {
    dispatch(setLoadingAuth(isLoading)); // تحديث حالة التحميل الأولية في Redux Store
    if (!isLoading) { // بمجرد انتهاء التحميل (سواء بنجاح أو فشل)
      if (isSuccess && userProfile) {
        dispatch(setAuthUser(userProfile)); // إذا نجح الجلب ووجدت بيانات، تخزين المستخدم
      } else if (isError) {
        dispatch(clearAuthUser()); // إذا فشل الجلب، مسح بيانات المستخدم (يعتبر غير مصادق عليه)
      }
    }
  }, [userProfile, isLoading, isSuccess, isError, dispatch]); // dependencies للـ useEffect

  // جلب حالة المصادقة وحالة التحميل الأولية من Redux Store
  // دي ينفع استعملها في مكونات تانية زي الناف او السايدبار عشان تظهر بيانات المستخدم
  // او حالة تسجيل الدخول
  // @ts-ignore
  // const authState = useSelector((state) => state.auth);
  // const isLoadingAuth = authState?.isLoadingAuth; // يحدد ما إذا كنا ما زلنا نتحقق من المصادقة

  // اللي تحت ده استخدمت مكانه ال loader لانه بيشتغل قبل ما المكون يتحمل
  // فلو المستخدم مش مصادق عليه مش هيشوف المكون اصلا
  //لاكن ماينفعش استعملها داخل مكون زي الناف او السايدبار عشان هما ظاهرين في كل الصفحات
  //=========================================
// انما ده بيعمل فلاش ويظهر المكون وبعدين يعيد التوجيه
  //=========================================
  // const authGuardLoader =  () => {
  //   const state = store.getState();
  // if (state.auth && state.auth.user) {
  //   return null;
  // }
  // throw redirect('/signin');
  // };


  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      // errorElement: <Err_404Page />, // <--- يمكنك إضافة عنصر خطأ عام هنا إذا أردت
      children: [
        { index: true, Component: Home}, // <--- إضافة الـ loader هنا أيضًا
        { path: "profile", Component: Profile }, // <--- إضافة الـ loader هنا أيضًا
        // يمكنك أيضًا إضافة errorElement هنا لـ Profile إذا أردت معالجة الأخطاء الخاصة به

        { path: "edite/:id", Component: Edite, loader: authLoader },
        { path: "search", Component: Search, loader: authLoader },
        { path: "view/:id", Component: View, loader: authLoader },
        { path: "addCustomer", Component: AddCustomer, loader: authLoader }, // <--- إضافة الـ loader هنا أيضًا
        { path: "signin", Component: Signin }, // <--- إضافة الـ loader هنا أيضًا
        { path: "register", Component: SignUp }, // <--- إضافة الـ loader هنا أيضًا
        { path: "*", Component: Err_404Page },
      ],
    },
  ]);
// <--- شاشة التحميل الأولية: تظهر أثناء التحقق من المصادقة الأولية
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default', // استخدام لون الخلفية من الثيم
          color: 'text.primary',         // استخدام لون النص من الثيم
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
