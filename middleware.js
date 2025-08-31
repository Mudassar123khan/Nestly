let Listing = require("./models/listing.js");
let Review = require('./models/review.js');
let ExpressError = require('./utils/ExpressError.js');
const {listingValidationSchema,reviewSchema} = require('./schema.js');

//Middleware to check if the user is logged in or not 
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You are not logged in!!");
    return res.redirect("/login");
  }
  next();
};

//Middleware to save the url where we have to redirect 
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//Middleware to check if the user is the owner of the listing or not 
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let oldListing = await Listing.findById(id);
  if (!oldListing.owner._id.equals(req.user._id)) {
    req.flash("error", `You don't have permission to ${req.originalMethod ==="GET"? "edit": "delete"}` );
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//Middleware for server side error handling for the listings using joi
module.exports.validateListing = (req,res,next)=>{
  let {error} = listingValidationSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

//Middleware for server side error handling for reviews using joi
module.exports.validateReview = (req,res,next)=>{
  let {error} = reviewSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}

//Middleware to check if the user is the author of the review
module.exports.isReviewAuthor = async(req,res,next)=>{
   let {id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", `You don't have permission to delete` );
    return res.redirect(`/listings/${id}`);
  }
  next();
}