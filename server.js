import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import cookieParser from "cookie-parser"
import { commonRouter } from './APIs/CommonAPI.js'
config()  //process.env it gives the all the data of env variables


const app = exp()
//add body parser middleware
app.use(exp.json())
//ads the cookie parser middleware
app.use(cookieParser())



//connect APIs
app.use('/user-api',userRoute);
app.use('/author-api',authorRoute);
app.use('/admin-api',adminRoute);
app.use('/common-api',commonRouter);



//connect to DB
const connectDB = async () => {
    try {
    await connect(process.env.DB_URL)
    console.log("DB Connection Success")
    //start http server
    app.listen(process.env.PORT,() => console.log("Server Started"))
    } catch(err) {
        console.log("Err in DB Connection",err)
    }
}
connectDB()



//Dealing with Invalid Path
//It should be placed after connecting to the API's any where
app.use((req,res,next) => {
    res.json({message: `${req.url} is Invalid Path`})
})



// //Error handling middleware
app.use((err,req,res,next) => {
    console.log("err :",err)
    res.json({message:"error",reason:err.message})
})


//template literal
// let a=10,b=20,c=30
// console.log(`a is ${a}  b is ${b} and ${c}`)
