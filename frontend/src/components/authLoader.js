// utils/authLoader.js (ملف جديد يمكنك إنشاؤه)
import { redirect } from "react-router-dom";
import axios from "axios"; // تأكد أن axios مستورد هنا أيضًا وأن `withCredentials` مضبوط

// لا تنسَ `axios.defaults.withCredentials = true;` في ملفك الرئيسي (App.js)
// أو قبل استخدامه هنا

export const authLoader = async () => {
  try {
    // حاول جلب بيانات الملف الشخصي
    // هذا هو نفس الطلب الذي يقوم به useGetUserProfileQuery
    // ولكن يتم تنفيذه في Loader قبل عرض المكون
    const response = await axios.get("http://localhost:3000/api/profile");

    // إذا نجح الطلب (أي أن المستخدم مصادق عليه)، قم بإرجاع بيانات المستخدم
    // يمكن تخزينها في الـ `loaderData`
    return response.data;
  } catch (error) {
    // إذا فشل الطلب وكان السبب هو 401 Unauthorized
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access in loader, redirecting to signin.");
      // <--- هذا هو الجزء السحري: إعادة التوجيه الفورية
      throw redirect("/signin");
    }
    // لأي خطأ آخر، يمكنك إلقاء الخطأ للسماح لـ ErrorBoundary بالتعامل معه
    // أو إرجاع قيمة خطأ محددة
    console.error("Error in authLoader:", error);
    throw new Error("Failed to load user profile in loader.");
  }
};

