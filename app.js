const express = require('express');
const app = express();
const mongoose= require('mongoose');
const path = require('path');
const methodOverRide = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

app.use(methodOverRide("_method"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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
