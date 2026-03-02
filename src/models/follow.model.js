const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    followr:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "follower is required"]
    },

    followee:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "followee is required"]
    }
},
{
    timestamps:true
})

const followModel = mongoose.model("follows", followSchema)

module.exports = followModel