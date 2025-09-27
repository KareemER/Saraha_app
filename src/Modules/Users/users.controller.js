import { Router } from "express";
import * as usersServices from "./users.service.js"
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";

const usersContoller = Router();

usersContoller.post('/signup',usersServices.userSignup)
usersContoller.post('/login', usersServices.userLogin)
usersContoller.patch('/update',authenticationMiddleware,usersServices.updateUser)
usersContoller.delete('/deleteUser',authenticationMiddleware,usersServices.deleteUser)
usersContoller.get('/userData',authenticationMiddleware,usersServices.getUserData)
usersContoller.put('/confirmation',usersServices.confirmationEmailService)
usersContoller.post('/refreshToken',usersServices.refreshTokenService)
usersContoller.post('/forgetPassword',usersServices.forgetPassword)
usersContoller.put('/resetPassword',usersServices.resetPassword)
usersContoller.put('/updatePassword',authenticationMiddleware,usersServices.updatePassword)
usersContoller.get('/getAllUsers',authorizationMiddleware([RolesEnum.SUPER_ADMIN]),usersServices.getAllUsers)

export default usersContoller;