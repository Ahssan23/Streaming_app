const express = require("express");
const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
const {Users, Video, Comments, Subs}= require("../models/models");




const comments = express.Router();



comments.post("/comment", async (req, res)=>{
    const comment = req.body.comment;
    const url = req.body.url;

    if (comment.length == 0){
        console.log("type somehting idiot")
    }else{

        const token = req.cookies['access_token'];
        const decoded = jwt.verify(token ,process.env.JWT_SECRET);
        
        const post_db = await Comments({user: decoded['username'], comment:comment, url:url});
        post_db.save()
        .then(()=>{
            res.redirect("/view_vid");
            console.log("comment addedd");
        })
        .catch((err)=>{
            console.log(err)
            res.redirect("/login")
        });
    }



})

module.exports = comments;
