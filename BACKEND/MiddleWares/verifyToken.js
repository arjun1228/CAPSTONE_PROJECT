import jwt from "jsonwebtoken"

export const verifyToken = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            // read token from cookies (requires cookie-parser in server)
            const token = req.cookies?.token
            if (!token) {
                return res.status(401).json({ message: "Unauthorized req. Plz login first" })
            }

            // verify and decode token
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

            //check if role is allowed (only if roles were specified)
            if(allowedRoles.length > 0 && !allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({error:`Forbidden. Token role is ${decodedToken.role}, required: ${allowedRoles.join(',')}`})
            }

            // attach user info to request for use in routes
            req.user = decodedToken

            next()
        } catch (err) {
            //jwt.verify throws if token is invalid/expired
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Session expired. Please login again.' })
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid Token. Please login.' })
            }
            // Handle other errors
            return res.status(500).json({ message: 'Authentication error', error: err.message })
        }
    }
}