const express = require('express');
const router = express.Router();


//Users
router.get("/",(req,res)=>{
     console.log(req.cookies);
    res.send("Request for all users");
});

router.get("/:id",(req,res)=>{
    res.send("Request for one user");
});

router.post("/",(req,res)=>{
    res.send("Post request for users")
})

router.delete("/:id",(req,res)=>{
    res.send("DELETE request for users")
})

module.exports = router;