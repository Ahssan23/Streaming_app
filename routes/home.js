const express  =require("express")
const {Video, Users} =require("../models/models")



const home = express.Router();

home.get("/", async(req , res)=>{
    const get_videos= await Video.find({})
    const url = get_videos.map((elements) =>{ 
        return elements


    });

    res.render("home", {"url":url});
})




module.exports = home;