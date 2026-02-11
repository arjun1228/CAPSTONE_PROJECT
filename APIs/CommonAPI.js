import exp from 'express'
import { authenticate } from '../services/AuthService.js'
import { verifyToken } from '../MiddleWares/verifyToken.js'
import { UserTypeModel } from '../Models/UserModel.js'
import bcrypt from 'bcryptjs'
export const commonRouter = exp.Router()

//login
commonRouter.post('/login', async (req,res) =>{
        let userCred = req.body
        //call authenticate service
        let {token,user} = await authenticate(userCred)
        //save token as HttpOnly cookie
        res.cookie("token",token, {
            httpOnly : true,
            sameSite : "lax",
            secure : false 
           })
        //send res
        res.status(200).json({message : "Login success",payload : user})
    })


//logout
commonRouter.get('/logout', async (req,res) => {
    //clear the cookie named 'token
    res.clearCookie('token', {
        httpOnly: true,     //must match original settings
        secure: false,      //must match original settings
        sameSite: "lax"     //must match original settings
    })
    res.status(200).json({message:"Logged out successfully"})
})


//change password
commonRouter.put('/change-password', verifyToken, async(req,res) =>
{
    //get current password and new password
    let {currentPassword,newPassword,email} = req.body

    //verify the user in db
    let userInDb = await UserTypeModel.findOne({email : email})
    //if user not found
    if(!userInDb) {
        return res.status(400).json({message:"User not found"})
    }
    //check the current password is correct
    let comparePassword = await bcrypt.compare(currentPassword,userInDb.password)
    //if compare is false
    if(!comparePassword) {
        return res.status(400).json({message:"Incorrect Password"})
    }
    let hashedNewPassword = await bcrypt.hash(newPassword,10);
    //assign the current password with the new password
    userInDb.password = hashedNewPassword
    await userInDb.save()
    //send res
    res.status(200).json({message:"Password changed"})
})