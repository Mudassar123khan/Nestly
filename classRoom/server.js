const express = require('express');
const app = express();
const users = require('./routes/user');
const posts = require('./routes/post.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.listen(3000,()=>{
    console.log("Server started");
});