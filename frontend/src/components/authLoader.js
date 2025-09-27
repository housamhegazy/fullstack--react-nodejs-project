// utils/authLoader.js (ملف جديد يمكنك إنشاؤه)
import { redirect } from "react-router-dom";
import axios from "axios"; // تأكد أن axios مستورد هنا أيضًا وأن `withCredentials` مضبوط


export const authLoader = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/profile");  
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access in loader, redirecting to signin.");
      // store.dispatch(clearAuthUser());
      // <--- هذا هو الجزء السحري: إعادة التوجيه الفورية
      throw redirect("/signin");
    }
    // لأي خطأ آخر، يمكنك إلقاء الخطأ للسماح لـ ErrorBoundary بالتعامل معه
    // أو إرجاع قيمة خطأ محددة
    console.error("Error in authLoader:", error);
    throw new Error("Failed to load user profile in loader.");
  }
};


// 2. Loader لمنع الوصول لصفحات Signin/Register
// =========================================================
// export const authPageLoader = async() => {
//     // هذا Loader لا يتطلب طلب شبكة، يعتمد فقط على Redux State
//     const authState = store.getState().auth;

//     if (authState.isAuthenticated) {
//         // إذا كان المستخدم مصادقًا عليه، نوجهه بعيدًا عن صفحة تسجيل الدخول/التسجيل
//         console.log("User is already authenticated, redirecting to home.");
//         throw redirect("/");
//     }
//     return null;
// };
