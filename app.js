const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json()); // convert into js object;
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');  // for don't req xyz.ejs for render simply file name;

// database connection
const dbURI = 'mongodb://127.0.0.1:27017/nodeJwt';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

// routes
app.get("*",checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth ,(req, res) => res.render('smoothies'));
app.use(authRoutes);// placing all the routes from authRoutes.js

// cookies
// app.get("/set-cookies", (req,res)=>{
//   // res.setHeader("set-Cookie", "newUser=true") // key=true;

//   res.cookie("newUser",false);
//   res.cookie("isEmployee", true, {maxAge: 1000*60*60*24, httpOnly:true});
//   res.send("set cookies");
// })

// app.get("/read-cookies",(req,res)=>{
//   const cookies = req.cookies;
//   console.log(cookies);
//   res.json(cookies);
// })