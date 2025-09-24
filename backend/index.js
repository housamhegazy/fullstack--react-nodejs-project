const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // لاستخدامها لقراءة JSON من الطلبات
const cors = require('cors'); // للسماح لـ frontend بالاتصال بـ backend
const app = express()
const port = 3000
const session = require('express-session'); // <--- إضافة هذا

const allRoutes = require('./routes/allRoutes')
const registerRoute = require('./routes/registerRoute')


// Middleware
app.use(bodyParser.json()); // يسمح لـ Express بقراءة JSON في body الطلبات
app.use(bodyParser.urlencoded({ extended: true })); // لقراءة بيانات النموذج المشفرة
app.use(cors()); // تفعيل CORS للسماح لـ frontend (الذي يعمل على منفذ مختلف) بالاتصال


//اعداد الجلسات 
app.use(session({
  secret: 'your_secret_key', // <--- قم بتغيير هذا إلى مفتاح سري قوي
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using https
}));
// ...
// ********************** الاتصال بـ MongoDB **********************
mongoose.connect('mongodb+srv://geohousam_db_user:UAc4KjEnIs8qVEEJ@addcustomercluster.xoewuxa.mongodb.net/all-data?retryWrites=true&w=majority&appName=addcustomercluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // Mongoose 6+ لا يحتاج لهذا الخيار
  // useFindAndModify: false // Mongoose 6+ لا يحتاج لهذا الخيار
})
.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('Could not connect to MongoDB...', err));
// يمكنك استبدال 'mongodb://localhost:27017/myusersdb' برابط اتصال MongoDB Atlas الخاص بك
// مثال: 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myusersdb?retryWrites=true&w=majority'
// ***************************************************************



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use('', allRoutes)
app.use('', registerRoute)
