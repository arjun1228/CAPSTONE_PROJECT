import exp from 'express'
import { register, authenticate } from "../services/AuthService.js"
import { checkUser } from '../MiddleWares/checkUser.js';
import { ArticleModel } from '../Models/ArticleModel.js';
import { verifyToken } from '../MiddleWares/verifyToken.js';
import { upload } from '../Config/Multer.js';
import cloudinary from '../Config/cloudinary.js';
import { uploadToCloudinary } from '../Config/CloudinaryUpload.js';

export const userRoute = exp.Router();



//register user 
userRoute.post("/users",upload.single("profileImageURL"),async (req, res, next) => {
        let cloudinaryResult;
            try {
                let userObj = req.body;

                // Step 1: upload image to cloudinary from memoryStorage (if exists)
                if (req.file) {
                  try {
                    cloudinaryResult = await uploadToCloudinary(req.file.buffer);
                  } catch (uploadErr) {
                    console.warn("User profile image upload failed, continuing without image:", uploadErr.message);
                  }
                }

                // Step 2: call existing register()
                const newUserObj = await register({
                ...userObj,
                role: "USER",
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

        }
        );


//read all articles (PROTECTED ROUTE)
userRoute.get('/articles', verifyToken("USER"), async(req, res) =>{
    //only need to verify user is authenticated, no specific user check needed
  let articles = await ArticleModel.find({isArticleActive: true}).populate("Comments.user","email firstName")
    //send res
    res.status(200).json({message: "All Articles are", payload: articles})
})




//add comment to article (PROTECTED ROUTE)
userRoute.put("/articles", verifyToken("USER"), checkUser, async (req, res) => {
  //get comment payload from req
  const { articleId, comment } = req.body;
  if (!articleId || !comment) {
    return res.status(400).json({ message: "articleId and comment are required" });
  }

  //always use authenticated user id from token
  const userId = req.user.userId;

  //find active article by id and add comment
  let articleWithComment = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true },
    { $push: { Comments: { user: userId, comment } } },
    { new: true, runValidators: true }
  ).populate("Comments.user","email firstName")

  //if article not found or inactive
  if (!articleWithComment) {
    return res.status(404).json({ message: "Article not found or inactive" });
  }

  //send res
  res.status(200).json({ message: "Comment added successfully", payload: articleWithComment });
});