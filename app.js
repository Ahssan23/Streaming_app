const express = require("express");
const auth = require("./routes/auth")
const mongoose = require("mongoose")
const upload = require("./routes/upload")
const home = require("./routes/home")
const view = require("./routes/view")
const subs = require("./routes/subscribe")
const comments = require("./routes/comments");
const likes = require("./routes/likes");
const sub_feed = require("./routes/subs_feed");
const search = require("./routes/search");



const app = express();



mongoose.connect("mongodb://localhost:27017/STREAMING").then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")
app.engine('ejs', require('ejs').__express);


app.use("/", auth)
app.use("/",upload)
app.use("/",home);
app.use("/", view);
app.use("/", subs);
app.use("/", comments);
app.use("/", likes);
app.use("/",sub_feed);
app.use("/",search);



app.listen(4000,()=>console.log("connected to the server"));