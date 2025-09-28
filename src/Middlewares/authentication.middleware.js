import jwt from "jsonwebtoken"
import User from "../DB/Models/user.model.js"
import RevokedToken from "../DB/Models/revoked-tokens.model.js";

export const authenticationMiddleware = async (req, res, next) => {

    const { accesstoken } = req.headers;
    let UserId
    if (!accesstoken) {
        return res.status(401).json({ message: "who are you? you're unauthroized to complete this action" })
    }

    jwt.verify(accesstoken, process.env.JWT_ACCESS_SECERET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        UserId = decoded.id
    })

    const blackListedToken  = await RevokedToken.findOne({tokenId:accesstoken})
    if(blackListedToken) return res.status(401).json({message : "Token is revoked"});

    const user = await User.findById(UserId)
    if (!user) {
        return res.status(401).json({ message: "user not found" })
    }

    req.loggedInUser = {_id:user._id , user , token:{tokenId:accesstoken.jti ,  expirationDate:accesstoken.exp}};
    next()
}