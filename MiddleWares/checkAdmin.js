import { UserTypeModel } from "../Models/UserModel.js"
import { ArticleModel } from "../Models/ArticleModel.js"

export const checkAdmin = async(req,res,next) => {
    //get admin id
    let {adminId} = req.body
    //verify admin
    let verifyAdmin = await UserTypeModel.findById(adminId)
     if(!verifyAdmin) {
       res.status(400).json({message:"Invalid Admin"})
    }
    ///if admin is found but role is different 
    if(verifyAdmin.role !== "ADMIN") {
        return res.status(403).json({message:"User is not an admin"})
    }
    //forward req to next
    next();
}