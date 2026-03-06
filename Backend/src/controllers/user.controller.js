const followModel = require("../models/follow.model")
const userModel = require("../models/user.model")


async function followUserController(req,res){ 

    const followerId = req.user.id
    const followeeUsername = req.params.username

    const followeeUser = await userModel.findOne({
        username: followeeUsername
    })

    if (!followeeUser) {
        return res.status(404).json({
            message: "Username doesn't exist"
        })
    }

    if (followeeUser._id.toString() === followerId) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        })
    }

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerId,
        followee: followeeUser._id
    })

    if (isAlreadyFollowing) {
        return res.status(200).json({
            message: `You're already following ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower: followerId,
        followee: followeeUser._id,
        status: "pending"
    })

    res.status(201).json({
        message: "pending",
        follow: followRecord 
    })
}

async function acceptFollowRequest(req, res) {

  const followerUsername = req.params.username
  const followeeId = req.user.id

  const followerUser = await userModel.findOne({ username: followerUsername })

  if (!followerUser) {
    return res.status(404).json({ message: "Follower not found" })
  }

  const followRequest = await followModel.findOne({
    follower: followerUser._id,
    followee: followeeId,
    status: "pending"
  })

  if (!followRequest) {
    return res.status(404).json({ message: "Request not found" })
  }

  followRequest.status = "accepted"
  await followRequest.save()

  res.json({ message: "Follow request accepted" })
}

async function rejectFollowRequest(req, res) {

  const followerUsername = req.params.username
  const followeeId = req.user.id

  const followerUser = await userModel.findOne({ username: followerUsername })

  if (!followerUser) {
    return res.status(404).json({ message: "Follower not found" })
  }

  const followRequest = await followModel.findOne({
    follower: followerUser._id,
    followee: followeeId,
    status: "pending"
  })

  if (!followRequest) {
    return res.status(404).json({ message: "Request not found" })
  }

  followRequest.status = "rejected"
  await followRequest.save()

  res.json({ message: "Follow request rejected" })
}


async function unfollowUserController(req,res){

    const followerId = req.user.id
    const followeeUsername = req.params.username

    const followeeUser = await userModel.findOne({
        username: followeeUsername
    })

    if (!followeeUser) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isUserFollowing = await followModel.findOne({
        follower: followerId,
        followee: followeeUser._id
    })

    if (!isUserFollowing) {
        return res.status(200).json({
            message: `You're not following ${followeeUsername}`
        })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    res.status(200).json({
        message: `You unfollowed ${followeeUsername}`
    })
}


module.exports = {
    followUserController,
    unfollowUserController,
    acceptFollowRequest,
    rejectFollowRequest
}