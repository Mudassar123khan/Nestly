const express = require('express')
const router = express.Router();


//Posts
router.get("/",(req,res)=>{
    res.send("Request for all posts");
});

router.get("/:id",(req,res)=>{
    res.send("Request for one post");
});

router.post("/",(req,res)=>{
    res.send("Post request for post")
})

router.delete("/:id",(req,res)=>{
    res.send("DELETE request for post")
})


module.exports = router;