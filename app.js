const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path');
const methodOverRide = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

app.use(methodOverRide("_method"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(flash());
const sessionOptions = {
    secret:"mmk",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
};
//Using Sessions
app.use(session(sessionOptions));

//Using Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main().then(()=>{
    console.log("mongodb connected");
}).catch((err)=>{
    console.log(err);
});

//Connecting our database using mongoose
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/imperial_hotels');
}

//home route
app.get("/", (req,res)=>{
    console.log("homepage was accessed");
    res.send("Home Page");
});


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//Error Handling route
app.all(/.*/,(req,res,next)=>{   //Here I have used /.*/  ---It is a js regular expression and which is used for receiving requests from any route
    next(new ExpressError(404,"page not found")); 
});


//Error Handling Middle-wares
app.use((err,req,res,next)=>{
    let {status=500 , message="Something went wrong"} = err;
    res.status(status).render("error.ejs",{err});
});

app.listen(8080,()=>{
    console.log("server is running at 8080");
});
