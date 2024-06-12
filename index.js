require("dotenv").config();
const express = require("express");
const path = require("path");
const { collection1, product } = require("./mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cookieparser = require("cookie-parser");
const auth = require("./auth");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// const port=process.env.PORT || 3000;
// console.log(process.env.SECRET_KEY)


const publicpath = path.join(__dirname, "public");
app.use(express.static(publicpath));

app.set("view engine", "ejs");
app.use(express.json());

app.use(cookieparser());

app.use(express.urlencoded({ extended: false }));

// Define a custom middleware to set the token in response.locals
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  res.locals.token = token;
  next();
});





app.get("/", (req, res) => {
  const token=req.cookies.jwt;
  res.render("home",{token:token});
});

app.get("/404", (req, res) => {
  res.render("404");
});

app.get("/login", (req, res) => {
  const token=req.cookies.jwt;

  res.render("login",{token:token});
});

app.get("/booking", auth, (req, res) => {
  // console.log(req.cookies.jwt)
  const token=req.cookies.jwt

  res.render("booking",{token:token});
});

app.get("/logout", auth, async(req, res) => {
  try {

    req.user.tokens=req.user.tokens.filter((currentelement)=>{

      return currentelement.token!==req.token

    })
    res.clearCookie("jwt")
    // console.log("logout successfully")
    await req.user.save();
    res.render("login")
    
  } catch (error) {
    res.status(500).send(error);
  }
  
});

app.get("/signup", (req, res) => {
  const token=req.cookies.jwt;

  res.render("signup",{token:token});
});

app.get("/romance", (req, res) => {
  const token=req.cookies.jwt;

  res.render("romance",{token:token});
});

app.get("/family", (req, res) => {
  const token=req.cookies.jwt;

  res.render("family",{token:token});
});

app.get("/friends", (req, res) => {
  const token=req.cookies.jwt;

  res.render("friends",{token:token});
});

app.get("/solo", (req, res) => {
  const token=req.cookies.jwt;

  res.render("solo",{token:token});
});

app.get("/adventure", (req, res) => {
  const token=req.cookies.jwt;

  res.render("adventure",{token:token});
});

app.get("/nature", (req, res) => {
  const token=req.cookies.jwt;

  res.render("nature",{token:token});
});

app.get("/religious", (req, res) => {
  const token=req.cookies.jwt;

  res.render("religious",{token:token});
});

app.get("/wateract", (req, res) => {
  const token=req.cookies.jwt;

  res.render("wateract",{token:token});
});

app.get("/wildlife", (req, res) => {
  const token=req.cookies.jwt;

  res.render("wildlife",{token:token});
});

app.get("/about", (req, res) => {
  const token=req.cookies.jwt;

  res.render("about",{token:token});
});



app.post("/signup", async (req, res) => {
  try {
    // console.log(req.body.username)
    // res.send(req.body.username)

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;
    if (password === cpassword) {
      const details = new collection1({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
      });

      // const token = await details.generateAuthToken();

      // res.cookie("jwt", token, {
      //   expires: new Date(Date.now() + 900000),
      //   httpOnly: true,
      // });
      //   console.log(cookie);

      const woohoo = await details.save();
      res.status(201).render("login");
    } else {
      res.send(
        "<script>alert('Make sure that your password and confirm password must be same'); window.location.href = '/signup';</script>"
      );
    }
  } catch (error) {
    // res.status(400).send(error)
    // res.render("404");
    res.send(
      "<script>alert('Invalid details'); window.location.href = '/login';</script>"
    );
  }
});

//login form

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const pass = req.body.password;

    const useremail = await collection1.findOne({ username: username });

    const ismatch = await bcrypt.compare(pass, useremail.password);

    const token = await useremail.generateAuthToken();
    // console.log(token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 10000000),
      httpOnly: true,
      // secure: true
    });

    // if(useremail.password===pass)
    if (ismatch) {
      
      res.status(201).render("booking");
      
      
    } else
      res.send(
        "<script>alert('Wrong username or password'); window.location.href = '/login';</script>"
      );
  } catch (error) {
    // res.status(400).send("Muje pagal samja hai kya!!!")
    // res.render("404");
    res.send(
      "<script>alert('Wrong username or password'); window.location.href = '/login';</script>"
    );

    // res.status(401).json({ message: 'Wrong username or password' });
  }
});

app.post("/contact", async (req, res) => {
  try {
    const contactdetails = new product({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });

    const wooh = await contactdetails.save();

    // res.status(201).render("home")
    res.render("home");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});


app.listen(3000, () => {
  console.log("connected");
});
