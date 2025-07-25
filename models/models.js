const mongoose = require("mongoose")



const UserSchema = mongoose.Schema({
    user:String,
    pass:String
})

const VideoSchema = mongoose.Schema({
    user:String,
    url :String,
    title: String,
    desc: String,
    thumbnail:String
})



const SubSchema = mongoose.Schema({
    user:String,
    subbed:String 
})

const CommentSchema = mongoose.Schema({
    user:String, 
    comment: String,
    url:String
})


const LikesSchema = mongoose.Schema({
    user: String,
    liked :String,
    url :String
})

const Users = mongoose.model("Users", UserSchema , "users")
const Video = mongoose.model("Video", VideoSchema , "videos")
const Subs  = mongoose.model("Subscribers", SubSchema , "subs")
const Comments = mongoose.model("Comments", CommentSchema, "comments")
const Likes = mongoose.model("Likes", LikesSchema, "likes")


module.exports = {Video , Users, Subs, Comments, Likes} ;