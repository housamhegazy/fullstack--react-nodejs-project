import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  useTheme,
} from '@mui/material';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined'; // أيقونة للتسجيل
import { Link } from 'react-router-dom';


function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme()
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError('جميع الحقول مطلوبة.');
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError('الرجاء إدخال بريد إلكتروني صالح.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      setLoading(false);
      return;
    }

    try {
      // هنا يمكنك محاكاة طلب API إلى الواجهة الخلفية (Backend) لتسجيل مستخدم جديد
      // مثال:
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ fullName, email, password }),
      // });
      // const data = await response.json();

      // For demonstration, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Simulate successful registration
      setSuccess('تم تسجيل حسابك بنجاح! جاري التوجيه إلى صفحة تسجيل الدخول...');
      // يمكنك هنا إعادة التوجيه إلى صفحة تسجيل الدخول
      // navigate('/signin'); // إذا كنت تستخدم react-router-dom
    } catch (apiError) {
      setError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
      console.error('Register API error:', apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 4,
            borderRadius: 2,
            boxShadow: 3,
            // color:`${theme.palette.mode === "dark" ? }`,
            bgcolor:`${theme.palette.mode === "dark" ? "background.paper":""}` ,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}> {/* استخدام اللون الأساسي للأيقونة */}
            <AppRegistrationOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            إنشاء حساب جديد
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="الاسم بالكامل"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={!!error && !fullName}
              helperText={!!error && !fullName ? 'الاسم بالكامل مطلوب' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error && !validateEmail(email)}
              helperText={!!error && !validateEmail(email) ? 'الرجاء إدخال بريد إلكتروني صالح' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && password.length < 6}
              helperText={!!error && password.length < 6 ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!error && password !== confirmPassword}
              helperText={!!error && password !== confirmPassword ? 'كلمتا المرور غير متطابقتين' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل'}
            </Button>
            <Box display="flex" justifyContent="center">
              <Link to="/signin" style={{color:`${theme.palette.mode === "dark" ? "white" : "black" }`}}>
                {"لديك حساب بالفعل؟ سجل الدخول من هنا"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>

  );
}

export default SignUp;