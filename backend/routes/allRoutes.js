const express = require('express')
const router = express.Router()

// المسار الافتراضي
app.get('/', (req, res) => {
  res.send('Hello World! This is your backend API.');
});


// ********************** مسارات (Routes) API للمستخدمين **********************

// 1. مسار لإضافة مستخدم جديد (POST)
app.post('/api/addcustomers', async (req, res) => {
  try {
    const newUser = new CustomerModel(req.body);
    await newUser.save();
    res.status(201).send(newUser); // 201 Created
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error (e.g., email already exists)
      return res.status(400).send({ message: 'Email already registered.' });
    }
    res.status(400).send(error); // 400 Bad Request if validation fails
  }
});


// 2. Route to Get All Users (GET)
app.get('/api/allcustomers', async (req, res) => {
  try {
    const users = await CustomerModel.find({}); // Fetch all users
    res.status(200).json(users); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});
// 3. Route to Get one User (GET)
app.get('/api/allcustomers/:id', async (req, res) => {
  try {
    const user = await CustomerModel.findById(req.params.id); // Fetch all users
    res.status(200).json(user); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});
// 4. Route to open one User in edit page (GET)
app.get('/api/edit/:id', async (req, res) => {
  try {
    const user = await CustomerModel.findById(req.params.id); // Fetch one customer
    res.status(200).json(user); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});

//5--update funct

app.put('/api/editcustomer/:id',async(req,res)=>{
    const { id } = req.params; // جلب الـ id من المعاملات
    const updatedData = req.body; // جلب البيانات المراد تحديثها من جسم الطلب
  try{
    const user = await CustomerModel.findByIdAndUpdate(id,updatedData,{ new: true, runValidators: true } )
    if (!user) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(user); // إرجاع المستخدم المحدّث
  }
  catch (error) {
    handleError(res, error);
  }
})
//6-delete function
app.delete("/api/allcustomers/:id",async(req,res)=>{
  try {
    const user = await CustomerModel.findByIdAndDelete(req.params.id); // Fetch all users
    res.status(200).json(user); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
})
//search function
app.get("/api/search",async(req,res)=>{
  try {
    const searchValue = req.query.svalue
    if (!searchValue) {
      // 2. إذا لم يتم تقديم قيمة للبحث، يمكنك إما:
      //    أ. إرجاع جميع المستخدمين (إذا كان هذا هو السلوك المطلوب لصفحة البحث الفارغة)
      //    ب. إرجاع مصفوفة فارغة أو رسالة تفيد بعدم وجود استعلام
      // const allUsers = await CustomerModel.find({});
      // return res.status(200).json(allUsers);
      // أو: 
      return res.status(200).json({ message: "Please provide a search query." });
    }
    const user = await CustomerModel.find({ $or: [
      { firstName: { $regex: searchValue, $options: "i" } },
      { lastName: { $regex: searchValue, $options: "i" } },
      { email: { $regex: searchValue, $options: "i" } },
      { phoneNumber: { $regex: searchValue, $options: "i" } },
      { country: { $regex: searchValue, $options: "i" } },
    ]
  }); // Fetch all users
    res.status(200).json(user); // 200 OK
  } catch (error) {
    handleError(res, error);
  }})
