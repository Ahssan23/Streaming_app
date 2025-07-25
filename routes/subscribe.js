const express = require("express")
const cookieparser= require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config();
const {Users,Video ,Subs} = require("../models/models")



const subscribe = express.Router();

subscribe.use(cookieparser())


subscribe.post("/subscribe", async (req, res)=>{
    const token = req.cookies['access_token']
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const subbed = req.body.subbed;
    let already_subbed = false ;

    const if_subbed = await Subs.find({user:decoded['username'], subbed:subbed})
    if (if_subbed.length ==0 ){

        const post_db = await Subs({user:decoded['username'], subbed:subbed})
        post_db.save()
        .then(()=>{
            res.redirect("/view_vid")
            console.log("subsribed")
        }).catch((err)=>console.log(err))
    }
    else{
        console.log('alrady subbed')
    }


})

subscribe.post("/unsubscribe", async (req, res)=>{
    const token = req.cookies['access_token']
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = req.body.user;
    console.log(user)


    const post_db =  Subs.findOneAndDelete({user:decoded['username'], subbed:user})
    .then(()=>{
        res.redirect("/view_vid")
        console.log("unsubsribed")
    }).catch((err)=>console.log(err))
  
})



module.exports = subscribe;