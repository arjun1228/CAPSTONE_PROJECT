import exp from 'express'
import { register, authenticate } from "../services/AuthService.js"
import { checkUser } from '../MiddleWares/checkUser.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { verifyToken } from '../MiddleWares/verifyToken.js';
import jwt from 'jsonwebtoken'

export const userRoute = exp.Router();



//register user 
userRoute.post('/users', async (req,res) => {
    //get the user obj from req
    let userObj = req.body
    //cal register
    const newUserObj = await register({...userObj,role:"USER"})
    //send res
    res.status(201).json({message : "User Created",payload: newUserObj})
})



//read all articles (PROTECTED ROUTE)
userRoute.get('/articles/:uid', verifyToken, checkUser, async(req, res) =>{
    //middleware already checks for user
    let articles = await ArticleModel.find({isArticleActive: true})
    //send res
    res.status(201).json({message: "Articles are", payload: articles})
})




//add comment to article (PROTECTED ROUTE)
userRoute.put('/articles', verifyToken, checkUser, async(req,res) => {
    //get the comment article from req
    let {articleId,comment : commentText} = req.body
    //find article
    let article = await ArticleModel.findById(articleId)
    if(!article) {
        return res.status(401).json({message:"Article not found"})
    }

    //create userCommentObj matching with userCommentSchema
    const userCommentObj = {
        user : req.userId,
        comment : commentText
    }

    //add comment to comments array
    article.Comments.push(userCommentObj)

    //save article with new comment
    await article.save()

    //send res
    res.status(200).json({message:"Commented Successfully",payload: userCommentObj})

})