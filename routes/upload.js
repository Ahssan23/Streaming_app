const express = require("express")
const {Video, Users}= require("../models/models")
const cloudinary = require("cloudinary").v2;
const cookieparser= require("cookie-parser");
const multer = require("multer")
const jwt = require("jsonwebtoken")
const env  = require("dotenv").config()
const fs = require("fs")


const uploading = multer({dest : "uploads/"})

const upload = express.Router();

upload.use(cookieparser())

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,           
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('cloudinary configured');



upload.get("/upload",(req, res)=>{
    try{ 

        token = req.cookies['access_token']
        decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decode)
        res.render("upload")

    }catch(err){
        res.redirect("/login")
        console.log(err)
    }

})


upload.post("/upload",uploading.fields([
    {name: "video" ,maxCount: 1},
    {name: "thumbnail", maxCount :1}
]),  async(req,res)=>{
    try{
        token = req.cookies['access_token']
        
        if(!token){
            return res.redirect("/login");
        };
        try{

            decode = jwt.verify(token, process.env.JWT_SECRET)
        }catch(err){
            return res.redirect("/login")
        }

        const title = req.body.title;
        const desc = req.body.desc;
        const token = req.cookies['access_token'];
        const video = req.files["video"][0].path;
        const thumbnail = req.files["thumbnail"][0].path;
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        
        const uploadVid = await cloudinary.uploader.upload(video, {folder: "uploads", resource_type: "video"})
        const uploadImg =await cloudinary.uploader.upload(thumbnail, {folder:"uploads",resource_type:"image" })
        
        fs.unlinkSync(video);
        fs.unlinkSync(thumbnail);
        
        res.redirect("/")
        let username = decode['username'];
        const post_db =  Video({user:username, url: uploadVid.url , title:title, desc :desc, thumbnail: uploadImg.url})
        post_db.save().then(()=>console.log("added to db "))
        .catch((err)=>{console.log(err)})
        
    }catch(err){
        res.redirect("/upload")
    }



   

})


module.exports = upload;