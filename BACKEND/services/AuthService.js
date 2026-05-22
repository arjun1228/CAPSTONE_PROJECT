import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {UserTypeModel} from "../Models/UserModel.js"
import {config}  from "dotenv"
config()

//register funtion
export const register  =async (userObj) => {
    //create document
    const userDoc = new UserTypeModel(userObj)
    //validate for empty passwords
    await userDoc.validate()
    //hash and replace plain password
    userDoc.password = await bcrypt.hash(userDoc.password,10)
    //save
    const created = await userDoc.save()
    //convert the doc to object to remove password
    const newUserObj = created.toObject()
    //remove password
    delete newUserObj.password
    //return user obj without password
    return newUserObj
}

//authenticate function
export const authenticate = async ({email,password}) => {
    console.log("🔐 Authenticate attempt:", { email, password: password ? "***" : "empty" })
    
    //check user with email and role
    const user = await UserTypeModel.findOne({email})
    console.log("👤 User found:", user ? `Yes (${user.email})` : "No")
    
    if(!user) {
        const err = new Error("Incorrect email. Please check your email address.")
        err.status = 401;
        throw err
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password,user.password)
    console.log("🔑 Password match:", isMatch)
    
    if(!isMatch) {
        const err = new Error("Incorrect password. Please try again.")
        err.status = 401
        throw err
    }

    //check isActive state
     if(user.isActive === false) {
        const err = new Error("Your account is blocked. Please contact Admin")
        err.status = 403
        throw err
    }


    //generation token
    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role,
            email: user.email,
            firstName: user.firstName,
            profileImageURL: user.profileImageURL,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
    const userObj = user.toObject();
    delete userObj.password;

    return {token, user: userObj}
}