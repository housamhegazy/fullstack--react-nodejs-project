// Redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false, // يحدد ما إذا كان المستخدم مصادقًا عليه
  user: null,             // يخزن بيانات المستخدم المصادق عليه (مثال: { _id, name, email, role })
  isLoadingAuth: true,    // مؤشر لتحميل حالة المصادقة الأولية (true أثناء جلب بيانات المستخدم من الخادم لأول مرة)
};
const authSlice = createSlice({
  name: 'auth', // اسم Slice، يُستخدم كجزء من اسم الـ Action Types (مثال: 'auth/setAuthUser')
  initialState,
  reducers: {
    // Reducer يُستخدم عند تسجيل الدخول بنجاح أو عند جلب بيانات المستخدم المصادق عليه
    setAuthUser: (state, action) => {
      state.isAuthenticated = true; // تعيين حالة المصادقة إلى صحيح
      state.user = action.payload;  // تخزين بيانات المستخدم المرسلة كـ payload
      state.isLoadingAuth = false;  // انتهاء التحميل الأولي
    },
    
    // Reducer يُستخدم عند تسجيل الخروج أو عند فشل المصادقة
    clearAuthUser: (state) => {
      state.isAuthenticated = false; // تعيين حالة المصادقة إلى خطأ
      state.user = null;             // مسح بيانات المستخدم
      state.isLoadingAuth = false;   // انتهاء التحميل الأولي (حتى لو فشل)
    },
    // Reducer يُستخدم لتتبع حالة التحقق الأولي من المصادقة (أثناء جلب /api/profile)
    setLoadingAuth: (state, action) => {
      state.isLoadingAuth = action.payload; // تحديث حالة التحميل (true/false)
    }
  },
  
  // يمكنك إضافة `extraReducers` هنا إذا كنت ترغب في التعامل مع الـ actions
  // الخاصة بـ RTK Query (مثل `userApi.endpoints.getUserProfile.matchFulfilled`)
  // بشكل مباشر لتحديث حالة المصادقة، ولكن النهج الحالي في App.js باستخدام useEffect
  // يعمل بشكل جيد ويوفر مرونة.
});

// تصدير الـ actions ليتم استخدامها في المكونات (مثل dispatch(setAuthUser(userData)))
export const { setAuthUser, clearAuthUser, setLoadingAuth } = authSlice.actions;

// تصدير الـ reducer ليتم إضافته إلى Redux Store
export default authSlice.reducer;