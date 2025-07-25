const express = require("express")
const cookieparser= require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const {Users, Video,Subs, Comments, Likes}= require("../models/models")


const view = express.Router();
view.use(express.urlencoded({ extended: true })); 
view.use(cookieparser());



view.get("/view_vid", async(req,res)=>{
    try{

        const url = req.cookies['url']
        const title = req.cookies['title']
        const desc = req.cookies['desc']
        const user = req.cookies['user']
        const token = req.cookies['access_token'];
        const get_comments = await Comments.find({});
        const get_likes = await Likes.find({});
        const likes = get_likes.filter((elements)=>{
            return elements.url == url;
        })
        const comments = get_comments.filter((elements)=>elements.url == url)
        .map((elements)=>({
            user:elements.user,
            comment:elements.comment
        }))
        
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);
        
        let already_subbed =false;
        
        const if_subbed = await Subs.find({user: decoded['username'], subbed: user})
        if(if_subbed.length != 0){
            already_subbed= true;
        }
        
        res.render("view", {"url" :url, "title": title , "desc":desc, 'user':user, "subscribed": already_subbed, "comments": comments, "likes": likes});
    
}catch(err){
    res.redirect("/login")
}


})



view.post("/view_vid", async(req,res)=>{
    try{

        const url = req.body.url;
        const title = req.body.title;
        const desc = req.body.desc;
        const user = req.body.user;
        const get_comments = await Comments.find({});
        const get_likes = await Likes.find({});
        const likes = get_likes.filter((elements)=>{
            return elements.url == url;
        })
        const comments = get_comments.filter((elements)=>{
            return elements.url == url;
        })

        const token = req.cookies['access_token'];
        const decoded  = jwt.verify(token, process.env.JWT_SECRET);

        let already_subbed =false;
        
        const if_subbed = await Subs.find({user: decoded['username'], subbed: user})
        if(if_subbed.length != 0){
        already_subbed= true;
        }

        res.clearCookie("url");
        res.clearCookie("title");
        res.clearCookie("desc");
        res.clearCookie("user");
        res.cookie("url", url);
        res.cookie("title", title)
        res.cookie("desc" ,desc)
        res.cookie("user", user)
        
        
        
        res.render("view" , {"url": url , "title" :title, "desc" :desc, "user" :user, "subscribed": already_subbed, "comments": comments, "likes": likes})
}
catch(err){
    res.redirect("/login");
    
}
})



module.exports = view;