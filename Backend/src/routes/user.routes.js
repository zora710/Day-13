const express = require("express")
const userController = require("../controllers/user.controller")
const identifyUser = require("../middlewares/auth.middleware")


const userRouter = express.Router()


userRouter.post("/follow/:username", identifyUser, userController.followUserController)

userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)

userRouter.patch("/follow/accept/:username", identifyUser, userController.acceptFollowRequest)

userRouter.patch("/follow/reject/:username", identifyUser, userController.rejectFollowRequest)



module.exports = userRouter