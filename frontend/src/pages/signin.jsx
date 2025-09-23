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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme()
  const validateEmail = (email) => {
    // regex بسيط للتحقق من تنسيق البريد الإلكتروني
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError('البريد الإلكتروني وكلمة المرور مطلوبان.');
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

    try {
      // هنا يمكنك محاكاة طلب API إلى الواجهة الخلفية (Backend)
      // مثال:
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // For demonstration, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      if (email === 'test@example.com' && password === 'password123') {
        setSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
        // يمكنك هنا إعادة التوجيه إلى لوحة التحكم أو الصفحة الرئيسية
        // navigate('/dashboard'); // إذا كنت تستخدم react-router-dom
      } else {
        setError('خطأ في البريد الإلكتروني أو كلمة المرور.');
      }
    } catch (apiError) {
      setError('حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.');
      console.error('Login API error:', apiError);
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
            bgcolor: 'background.paper', // يستخدم لون الخلفية من الثيم (أبيض في Light, داكن في Dark)
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            تسجيل الدخول
          </Typography>
          {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="البريد الإلكتروني"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!error && !validateEmail(email)} // يظهر الخطأ إذا كان هناك خطأ عام و البريد غير صالح
              helperText={!!error && !validateEmail(email) ? 'البريد الإلكتروني غير صالح' : ''}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && password.length < 6}
              helperText={!!error && password.length < 6 ? 'كلمة المرور قصيرة جداً' : ''}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </Button>
            <Box display="flex" justifyContent="center">
              <Link to="#"style={{color:`${theme.palette.mode === "dark" ? "white" : "black" }`}}>
                نسيت كلمة المرور؟
              </Link>
            </Box>
            <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
              <Link to="/register" style={{color:`${theme.palette.mode === "dark" ? "white" : "black" }`}}>
                {"ليس لديك حساب؟ سجل الآن"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Container>
  );
}

export default SignIn;