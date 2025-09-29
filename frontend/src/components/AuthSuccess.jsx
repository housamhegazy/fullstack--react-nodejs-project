import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthSuccess = () => {
  // const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    
      navigate('/dashboard'); // إعادة توجيه إلى الصفحة الرئيسية
    
  }, [ navigate]);

  return <div>جاري تسجيل الدخول...</div>;
};

export default AuthSuccess;