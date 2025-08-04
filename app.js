const express = require('express');
const app = express();
const mongoose= require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const { url } = require('inspector');
const methodOverRide = require('method-override');
const ejsMate = require('ejs-mate');

app.use(methodOverRide("_method"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
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

//Route to create a new listing
app.get("/listings/new",(req,res)=>{
    console.log("request to create new listinng is received");
    res.render("listings/new.ejs");
});

//Route to add the new listing to database
app.post("/listings",async (req,res)=>{
    console.log("Request to post the data to DB is received");
    let {title,description,price,url,location,country} = req.body;
    await Listing.insertOne({
        title:title,
        description:description,
        image:{
            url:url
        },
        price:price,
        location:location,
        country:country
    });
    
    res.redirect("/listings");
});

//Route to get all the listings
app.get("/listings",async (req,res)=>{
    let listings =await Listing.find();
    console.log("request to all the listings is received");
    res.render("listings/index.ejs",{listings});
});

//Route to show the info of only one listng
app.get("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let details =await Listing.findById(id);
    console.log(`Request to show listing is received with id ${id}`);
    res.render("listings/show.ejs",{details});
});

//Route to edit the details
app.get("/listings/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let obj=await Listing.findById(id);
    console.log("Request to edit is received");
    res.render("listings/edit.ejs",{obj});
});

//Route to put the data edited data in DB
app.put("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    let {title,description,price,url,location,country} = req.body;
    console.log("edits saved");
    await Listing.findByIdAndDelete(id);
    await Listing.insertOne({
         title:title,
        description:description,
        image:{
            url:url
        },
        price:price,
        location:location,
        country:country
    })
    res.redirect("/listings");
});

//Route to delete a listing
app.delete("/listings/:id",async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Request to delete a listing is received");
    res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log("server is running at 8080");
});
