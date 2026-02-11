import exp from 'express'
import { register,authenticate } from '../services/AuthService.js';
import { UserTypeModel } from '../Models/UserModel.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { checkAuthor } from '../MiddleWares/checkAuthor.js';

export const authorRoute = exp.Router();



//register author (PUBLIC)
authorRoute.post('/users', async (req,res) => {
    //get the user obj from req
    let userObj = req.body
    //call register
    const newUserObj = await register({...userObj,role:"AUTHOR"})
    //send res
    res.status(201).json({message : "Author Created",payload: newUserObj})
})



//create article (PROTECTED)
authorRoute.post('/articles',checkAuthor, async (req,res) => {
    //get article from req
    let articleObj = req.body
    //check for the author it is done by middleware
    //create article doc
    let articleDoc = await new ArticleModel(articleObj)
    //save 
    let newArticelObj = await articleDoc.save()
    //send res
    res.status(201).json({message:"Article Created",payload:newArticelObj})
})


//read articles of author (PROTECTED)
authorRoute.get('/articles/:authorId',checkAuthor, async(req,res) => {
    let authorId = req.params.authorId
    //check the author it is done by middleware
    //read articles by this author which are active
    let articles = await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author","firstName email")
    //send res
    res.status(200).json({message : "Articles ",payload: articles})
})



//Edit article (PROTECTED)
authorRoute.put('/articles', checkAuthor, async(req, res) => {
    //get modifiedArticle author from req
    let {articleId, title, Category, Content, author} = req.body
    
    //find article with the id
    let articleOfDb = await ArticleModel.findOne({_id: articleId, author: author})
    if(!articleOfDb){
        res.status(401).json({message: "No such article from this author"})
    }

    //update the article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,{
        $set: {title, Category, Content}
    },
        {new: true})

    //send res(updated article)
    res.status(201).json({message: "Article edited", payload: updatedArticle})
})



//Delete(soft delete) article (PROTECTED)
authorRoute.put('/articles/delete', checkAuthor, async(req, res) =>{
    let {author, articleId} = req.body
    //find article with the articleId
    let articleOfDb = await ArticleModel.findOne({_id: articleId, author: author})
    if(!articleOfDb){
        res.status(401).json({message: "No such article from this author"})
    }

    //make it inactive i.e soft delete
    let deleteObj = await ArticleModel.updateOne({_id: articleId}, {$set: {isArticleActive: false}},{new:true})
    res.status(201).json({message: "Article deleted"})
})


//the values of the cokkkies are automatically stored in the request