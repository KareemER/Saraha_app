import jwt from "jsonwebtoken"
import User from "../DB/Models/user.model.js"

export const authenticationMiddleware = async (req, res, next) => {

    const { accesstoken } = req.headers;
    let UserId
    if (!accesstoken) {
        return res.status(401).json({ message: "who are you? you're unauthroized to complete this action" })
    }

    jwt.verify(accesstoken, "qazplSecret54321key67890", (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        UserId = decoded.id
    })

    const user = await User.findById(UserId)
    if (!user) {
        return res.status(401).json({ message: "user not found" })
    }

    req.loggedInUser = user;
    next()
}