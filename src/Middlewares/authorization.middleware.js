export const authorizationMiddleware = (authorzedRoles) => {
    return (req,res,next)=> {
        const {user:{role}} = req.loggedInUser;
        if(!authorzedRoles.include(role)){
            return res.status(401).json({message:"Unauthroized"})
        }
    }
} 