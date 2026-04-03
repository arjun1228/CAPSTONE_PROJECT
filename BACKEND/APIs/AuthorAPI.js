import exp from 'express'
import { register,authenticate } from '../services/AuthService.js';
import { UserTypeModel } from '../Models/UserModel.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { checkAuthor } from '../MiddleWares/checkAuthor.js';
import { verifyToken } from '../MiddleWares/verifyToken.js';
import { upload } from '../Config/Multer.js';
import cloudinary from '../Config/cloudinary.js';
import { uploadToCloudinary } from '../Config/CloudinaryUpload.js';

export const authorRoute = exp.Router();



//register author (PUBLIC)
authorRoute.post("/users", upload.single("profileImageURL"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    const userObj = req.body;

    // Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      try {
        cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      } catch (uploadErr) {
        console.warn("Author profile image upload failed, continuing without image:", uploadErr.message);
      }
    }

    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "AUTHOR",
      profileImageURL: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // Step 3: rollback 
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); // send to your error middleware
  }
});



//create article (PROTECTED)
authorRoute.post('/articles',verifyToken("AUTHOR"), checkAuthor, async (req,res) => {
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


//delete(soft delete) article(Protected route) 
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article
  const article = await ArticleModel.findById(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "deleted"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "restored" : "deleted"} successfully`,
    payload: article
  });
});


//read articles of author (PROTECTED)
authorRoute.get('/articles/:authorId',verifyToken("AUTHOR"), checkAuthor, async(req,res) => {
    let authorId = req.params.authorId
    //check the author it is done by middleware
  //read all articles by this author (active + deleted)
  let articles = await ArticleModel.find({author:authorId}).populate("author","firstName email")
    //send res
    res.status(200).json({message : "Articles ",payload: articles})
})



//Edit article (PROTECTED)
authorRoute.put('/articles', verifyToken("AUTHOR"), checkAuthor, async(req, res) => {
    //get modifiedArticle author from req
    let {articleId, title, Category, Content, author} = req.body
    
    //find article with the id
    let articleOfDb = await ArticleModel.findOne({_id: articleId, author: author})
    if(!articleOfDb){
      return res.status(401).json({message: "No such article from this author"})
    }

    //update the article
    let updatedArticle = await ArticleModel.findByIdAndUpdate(articleId,{
        $set: {title, Category, Content}
    },
        {new: true})

    //send res(updated article)
    res.status(201).json({message: "Article edited", payload: updatedArticle})
})

