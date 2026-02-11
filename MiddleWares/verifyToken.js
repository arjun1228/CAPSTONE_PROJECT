import jwt from "jsonwebtoken"
export const verifyToken = async(req, res, next) =>{
    //read token from req
    let token = req.cookies.token
    if(!token){
        return res.status(400).json({message: "Unauthorized req. Plz login first"})
        }

    //verify validity of the token
    let decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    //forward req to next middleware
    next()
}