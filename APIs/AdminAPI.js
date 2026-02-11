import exp from 'express'
import { authenticate } from '../services/AuthService.js';
import { checkAdmin } from '../MiddleWares/checkAdmin.js';
import { UserTypeModel } from '../Models/UserModel.js';
import { verifyToken } from '../MiddleWares/verifyToken.js';

export const adminRoute = exp.Router();


//Read all articles (Optional)


//Block user route
adminRoute.put('/block',verifyToken, async (req, res) =>{
    //get userObj from req
    let userObj = req.body
    
    //find user in Db
    let userInDb = await UserTypeModel.find({email: userObj.email})
    if(!userInDb){
        return res.status(404).json({message: "User not found"})
    }
    //update user to inactive
    await UserTypeModel.updateOne({email: userObj.email},{$set: {isActive: false}})
    //send res
    res.status(200).json({message: "User blocked"})
})

//Unblock user route
adminRoute.put('/unblock',verifyToken, async (req, res) =>{
    //get userObj from req
    let userObj = req.body
    
    //find user in Db
    let userInDb = await UserTypeModel.find({email: userObj.email})
    if(!userInDb){
        return res.status(404).json({message: "User not found"})
    }
    //update user to inactive
    await UserTypeModel.updateOne({email: userObj.email},{$set: {isActive: true}})
    //send res
    res.status(200).json({message: "User Unblocked"})
})