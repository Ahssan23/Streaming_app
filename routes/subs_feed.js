const express = require("express")
const {Users, Video,Subs, Comments, Likes}= require("../models/models")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()


const sub_feed = express.Router();

sub_feed.get("/subscriptions", async(req,res)=>{
    try{

        const token = req.cookies['access_token'];
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        const users = await Subs.find({user:decoded['username']})
        const subbed = users.map((elements)=>{
            return elements.subbed
        })
        const url = await Video.find({user: subbed})
        
        res.render("home", {"url": url})
    }    

    catch(err){
        console.log(err)
        res.redirect("/login")
    }
})


module.exports = sub_feed;