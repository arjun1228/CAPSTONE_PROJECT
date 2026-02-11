import { Schema,model } from "mongoose";


//create user comment Schema
const userCommentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'user'
    },
    comment : {
        type : String
    }
})

//create article Schema
const articleSchema = new Schema({
    author: {
    type : Schema.Types.ObjectId,
    ref : "user",
    required : [true,"Author ID is required"]
    },
    title : {
        type : String,
        required : [true,"Title is required"]
    },
    Category : {
        type : String,
        required : [true,"Catrgory is required"]
    },
    Content :{
        type : String,
        required : [true,"Content is required"]
    },
    Comments : [userCommentSchema],
    isArticleActive : {
        type : Boolean,
        default : true
    }
},{
    strict :"throw",
    timestamps : true,
    versionKey : false
}) 

//create model
export const ArticleModel = model("Article",articleSchema);
