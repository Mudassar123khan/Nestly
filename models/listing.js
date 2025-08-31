const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');

const imagelink = "https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{
        filename:{
            type:String,
            default:"listingimage"
        },
        url:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
        if(listing.reviews){
            await Review.deleteMany({_id:{$in:listing.reviews}});
        }
});

let Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;