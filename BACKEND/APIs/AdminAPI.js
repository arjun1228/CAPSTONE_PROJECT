import exp from 'express'
import { UserTypeModel } from '../Models/UserModel.js';
import { verifyToken } from '../MiddleWares/verifyToken.js';

export const adminRoute = exp.Router();


//Read all articles (Optional)

//Get all users for admin dashboard
adminRoute.get('/users', verifyToken('ADMIN'), async (req, res, next) => {
    try {
        const users = await UserTypeModel.find({ role: { $in: ['USER', 'AUTHOR'] } })
            .select('-password')
            .sort({ createdAt: -1 })

        res.status(200).json({
            message: 'Users fetched successfully',
            payload: users,
        })
    } catch (err) {
        next(err)
    }
})


//Block user route
adminRoute.put('/block', verifyToken('ADMIN'), async (req, res, next) => {
    try {
        const { email } = req.body

        const userInDb = await UserTypeModel.findOne({ email })
        if (!userInDb) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (userInDb.role === 'ADMIN') {
            return res.status(403).json({ message: 'Admin users cannot be blocked' })
        }

        await UserTypeModel.updateOne({ email }, { $set: { isActive: false } })

        res.status(200).json({ message: 'User blocked' })
    } catch (err) {
        next(err)
    }
})

//Unblock user route
adminRoute.put('/unblock', verifyToken('ADMIN'), async (req, res, next) => {
    try {
        const { email } = req.body

        const userInDb = await UserTypeModel.findOne({ email })
        if (!userInDb) {
            return res.status(404).json({ message: 'User not found' })
        }

        await UserTypeModel.updateOne({ email }, { $set: { isActive: true } })

        res.status(200).json({ message: 'User unblocked' })
    } catch (err) {
        next(err)
    }
})