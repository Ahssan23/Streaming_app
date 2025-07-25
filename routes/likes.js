const express = require("express");
const jwt = require("jsonwebtoken");
const {Users, Video, Comments, Subs, Likes}= require("../models/models");
const env = require("dotenv").config();


const likes = express.Router();

likes.post("/like", async ( req, res)=>{
    try{

        const token = req.cookies['access_token'];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const liked = req.body.user;
        const url = req.body.url; 
        console.log("this is liked", liked)
        const if_liked = await Likes.find({user:decoded['username'], liked:liked, url:url});
        if(if_liked.length ==0 ){
            
        
        
            const post_db = await Likes({user:decoded['username'], liked:liked, url:url});
            post_db.save()
            .then(()=>{
                res.redirect("view_vid");
                console.log("liked");
            })
            .catch((err)=>{
                res.redirect("/login");
            })
            }
            else{
                res.redirect("view_vid")
            }
        }
    

    catch(err){
        res.redirect("/login");
        }
})



module.exports = likes;




