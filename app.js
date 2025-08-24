const express = require('express');
const app = express();
const mongoose= require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const { url } = require('inspector');
const methodOverRide = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const {listingValidationSchema,reviewSchema} = require('./schema.js');

const Review = require('./models/review.js');

app.use(methodOverRide("_method"));
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing = (req,res,next)=>{
  let {error} = listingValidationSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}
const validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

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
app.post("/listings",validateListing, wrapAsync(async (req,res)=>{
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
    
    res.redirect("/listings");
}));

//Route to get all the listings
app.get("/listings",wrapAsync(async (req,res)=>{
    let listings =await Listing.find();
    console.log("request to all the listings is received");
    res.render("listings/index.ejs",{listings});
}));

//Route to show the info of only one listng
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let details =await Listing.findById(id).populate("reviews");
    console.log(`Request to show listing is received with id ${id}`);
    res.render("listings/show.ejs",{details});
}));

//Route to edit the details
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let obj=await Listing.findById(id);
    console.log("Request to edit is received");
    res.render("listings/edit.ejs",{obj});
}));

//Route to put the data edited data in DB
app.put("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
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
    })
    res.redirect("/listings");
}));

//Route to delete a listing
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Request to delete a listing is received");
    res.redirect("/listings");
}));

//Route to add a review to a listing
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req,res)=>{
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    console.log(newReview);
    console.log("Review Added");
    await listing.save();  
    res.redirect(`/listings/${listing._id}`);
}));

//Route to delete a review
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    console.log("delete request received");
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

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
