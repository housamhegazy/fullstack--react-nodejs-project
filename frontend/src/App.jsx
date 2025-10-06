//***********************ملاحظات هامه ********************** */
// نعتمد بشكل اساسي على الريأكت هوك لحماية المسارات
// ونعتمد بشكل اساسي على ملف authSlice  للتحقق من حالة المستخدم في كل انحاء التطبيق
//   (RTK Query)ونعتمد بشكل اساسي على useGetUserProfileQuery للحصول على بيانات المستخدم والتعديل عليها
//***********************ملاحظات هامه ********************** */

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"; // <--- هذا هو الاستيراد الصحيح والوحيد لحزمة التوجيه
import Profile from "./pages/Profile";
import Customers from "./pages/Customers";
import Edite from "./pages/Edite";
import Search from "./pages/Search";
import View from "./pages/View";
import AddCustomer from "./pages/AddCustomer";
import Root from "./Root";
import Err_404Page from "./pages/Err_404Page";
import Signin from "./pages/signin";
import SignUp from "./pages/register";
import AuthSuccess from "./components/AuthSuccess";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoadingAuth, setAuthUser, clearAuthUser } from "./Redux/authSlice";
import { useGetUserProfileQuery } from "./Redux/userApi";

// <--- استيراد الـ loader الجديد
import { authLoader } from "./components/authLoader"; // استيراد الـ loader لصفحة تسجيل الدخول
import LoadingPage from "./components/loading/loadingPage";
import FetchingdataLoader from "./components/loading/fetchingData";
import ResetPassword from "./pages/reset-password/resetPassword";
import ForgotPassword from "./pages/reset-password/forgetPassword";

const ProtectedRoute = ({ Component }) => (
  <Suspense fallback={<LoadingPage />}>
    <Component />
  </Suspense>
);

function App() {
  // في App.js
const localTheme = localStorage.getItem("localTheme");
const defaultMode = localTheme === null ? "light" : localTheme === "light" ? "light" : "dark";
  const dispatch = useDispatch();
// const navigate = useNavigate()
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
  useEffect(() => {
    dispatch(setLoadingAuth(isLoading));
    if (!isLoading) {
      if (isSuccess && userProfile) {
        dispatch(setAuthUser(userProfile));
      } else if (isError) {
        dispatch(clearAuthUser());
      }
    }
  }, [userProfile, isLoading, isSuccess, isError, dispatch]);



  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      children: [
        {
          index: true,
          element: <ProtectedRoute Component={Customers} />,
          loader: authLoader,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader, // شاشة التحميل داخل الكومبوننت نفسه حتى لا تظهر شاشه بيضاء 
        }, // <--- إضافة الـ loader هنا أيضًا
        {
          path: "profile",
          element: <ProtectedRoute Component={Profile} />,
          loader: authLoader,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        }, 
        {
          path: "edite/:id",
          element: <ProtectedRoute Component={Edite} />,
          loader: authLoader,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "search",
          element: <ProtectedRoute Component={Search} />,
          loader: authLoader,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "view/:id",
          element: <ProtectedRoute Component={View} />,
          loader: authLoader,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "addCustomer",
          element: <ProtectedRoute Component={AddCustomer} />,
          loader: authLoader,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        }, 
        {
          path: "signin",
          Component: Signin,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        }, 
        {
          path: "register",
          Component: SignUp,
          errorElement: <Err_404Page />,
          HydrateFallback: FetchingdataLoader,
        }, 
        { path: "auth-success", Component: AuthSuccess }, // إضافة مسار AuthSuccess هنا
        { path: "*", Component: Err_404Page },
          // المسارات الجديدة لاسترداد كلمة المرور
            { path: "forgot-password", Component: ForgotPassword }, // لطلب الإيميل
            { path: "reset-password/:token", Component: ResetPassword }, // لإعادة تعيين كلمة المرور
            // ...
      ],
    },
  ]);
  // <--- شاشة التحميل الأولية: تظهر أثناء التحقق من المصادقة الأولية
  if (isLoading) {
    return <LoadingPage mode={defaultMode}/>;
  }

  // بمجرد انتهاء التحميل الأولي، يتم عرض التطبيق بالكامل

  return <RouterProvider router={router} fallbackElement={FetchingdataLoader} />;
}
export default App;
