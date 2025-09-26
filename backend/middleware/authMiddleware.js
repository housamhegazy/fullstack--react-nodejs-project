// middleware/authMiddleware.js (المعدل لـ React/API Backend)
// تعمل لحماية المسارات التي تتطلب مصادقة المستخدم وايضا جلب بيانات المستخدم
const User = require('../models/userModel'); // تأكد أن هذا هو اسم ملف الموديل الصحيح

async function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        try {
            // جلب المستخدم من قاعدة البيانات
            // استخدم .select('-password') لعدم إرسال كلمة المرور المشفرة
            const user = await User.findById(req.session.userId).select('-password');

            if (!user) {
                // المستخدم لم يعد موجودًا في DB (ربما تم حذفه)
                req.session.destroy(() => { // تدمير الجلسة الحالية
                    return res.status(401).json({ message: "غير مصرح به: المستخدم غير موجود أو تم حذفه." });
                });
                return; // مهم جداً للإنهاء بعد destroy
            }

            // تخزين كائن المستخدم في req.user ليتم الوصول إليه في الـ route handlers
            req.user = user;
            next(); // المستخدم مسجل دخول ووجد، استمر في معالجة الطلب

        } catch (error) {
            console.error("Error fetching user in authMiddleware:", error);
            // قد يكون خطأ في الاتصال بالـ DB أو ID خاطئ
            return res.status(500).json({ message: "حدث خطأ داخلي في الخادم أثناء المصادقة." });
        }
    } else {
        // المستخدم غير مسجل دخول
        return res.status(401).json({ message: "غير مصرح به: الرجاء تسجيل الدخول أولا." });
    }
}

module.exports = isAuthenticated;