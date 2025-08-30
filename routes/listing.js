const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingValidationSchema} = require('../schema.js');
const { isLoggedIn } = require('../middleware.js');


const validateListing = (req,res,next)=>{
  let {error} = listingValidationSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

//Route to create a new listing
router.get("/new",isLoggedIn,(req,res)=>{
    
    console.log("request to create new listinng is received");
    res.render("listings/new.ejs");
});

//Route to add the new listing to database
router.post("/",validateListing,isLoggedIn, wrapAsync(async (req,res)=>{
    console.log("Request to post the data to DB is received");
    
    let {title,description,price,url,location,country} = req.body;
     const listingData = {
        title,
        description,
        image: {
            url: url
        },
        price,
        location,
        country
    };

    await Listing.create(listingData);
    req.flash("success","New listing added");
    res.redirect("/listings");
}));

//Route to get all the listings
router.get("/",wrapAsync(async (req,res)=>{
    let listings =await Listing.find();
    console.log("request to all the listings is received");
    res.render("listings/index.ejs",{listings});
}));

//Route to show the info of only one listng
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let details =await Listing.findById(id).populate("reviews");
    if(!details){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    console.log(`Request to show listing is received with id ${id}`);
    res.render("listings/show.ejs",{details});
}));

//Route to edit the details
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let obj=await Listing.findById(id);
    if(!obj){
        req.flash("error","Listing does not exist");
        return res.redirect("/listings");
    }
    console.log("Request to edit is received");
    res.render("listings/edit.ejs",{obj});
}));

//Route to put the data edited data in DB
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let {title,description,price,url,location,country} = req.body;
     if(!title || !description || !price || !url || !location || !country){
        throw new ExpressError(400,"All the fields are required!! Please send data");
    }
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
    });
    req.flash("success","Listing Updated");
    res.redirect("/listings");
}));

//Route to delete a listing
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Request to delete a listing is received");
    req.flash("success","Listing deleted");
    res.redirect("/listings");
}));


module.exports= router;