import { UserTypeModel } from "../Models/UserModel.js"
import { ArticleModel } from "../Models/ArticleModel.js"

export const checkAuthor = async (req,res,next) => {
    //get author id from token, params, or body
    let authorId = req.user?.userId || req.params?.authorId || req.body?.author
    //verify author
    let verifyAuthor = await UserTypeModel.findById(authorId)
     if(!verifyAuthor) {
       return res.status(400).json({message:"Invalid Author"})
    }
    ///if author is found but role is different 
    if(verifyAuthor.role !== "AUTHOR") {
        return res.status(403).json({message:"User is not an author"})
    }
    //if author is blocked
    if(!verifyAuthor.isActive) {
        return res.status(403).json({message:"Author account is not active"})
    }
    //forward req to next
    next();
}