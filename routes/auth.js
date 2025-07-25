const express = require("express")
const {Video, Users} = require("../models/models")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const env = require("dotenv").config();

const auth = express.Router();


auth.get("/signup", (req,res)=>{
    res.render("signup")

})

auth.post("/signup", async(req ,res)=>{
    const user = req.body.name
    const pass = req.body.pass
    
    find_user = await Users.find({user:user});
    if (find_user.length == 0 ){
        console.log("good to go ")
        bcrypt.hash(pass, 10 ,async(err,hash)=>{
            if(err)console.log(err);
            
            if(hash){
                post_db = await Users({user:user, pass:hash})
                post_db.save()
                .then(() =>{
                res.redirect("/login")
                console.log("Creds posted")
            })
                
                .catch((err) => console.log(err));
                
            }
        })
    }else{
        console.log("user already exists")
    }
    })





auth.get("/login", async(req,res)=>{
    res.render("login")
})


auth.post("/login",async(req,res)=>{
    const users = req.body.name;
    const pass = req.body.pass;

    try{
        find_creds = await Users.find({user:users})

        const user= await find_creds.map(async (elements)=>{
            console.log(elements.pass)
            const find_username = await Users.find({user:elements.user});
            if (find_username.length != 0){

                
                
                bcrypt.compare(pass, elements.pass, async(err,hash)=>{
                    if(err)console.log(err);
                    if(hash){
                        console.log("password matched login successful")

                        data = {
                            "username": users
                        }
                        const token = jwt.sign(data,process.env.JWT_SECRET, {"expiresIn": "20min"} )
                        res.cookie("access_token", token)
                        res.redirect("/")


                    }else{
                        res.redirect("/login")
                        console.log("wrong password")
                    }
                })
            }
            else{
                res.redirect("/login")
                console.log("wrong username")
            }
        })
    }catch(err){
        res.redirect("/login")
        console.log(err)
    }
})

module.exports = auth;
