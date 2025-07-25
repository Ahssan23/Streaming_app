const express = require("express")
const {Users, Video, Comments, Subs, Likes}= require("../models/models");




const search = express.Router()


search.get("/search", async(req,res)=>{
    const search = req.query.search;
    const get_vid = await Video.find({ title: { $regex: search, $options: "i" } });

    const vid = get_vid.map((element) => element);
    console.log(vid)
    res.render("home", {"url": vid})
})


module.exports = search;


