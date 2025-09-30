import { Router } from "express";
import * as usersServices from "./users.service.js"
import * as validation from "../../Validators/Schemas/user.schema.js"
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
import { authorizationMiddleware } from "../../Middlewares/authorization.middleware.js";
import { RolesEnum } from "../../Common/user.enum.js";
import { hostUpload } from "../../Middlewares/mutler.middleware.js";

const usersContoller = Router();

usersContoller.post('/signup', validationMiddleware(validation.SignUpSchema), usersServices.userSignup)
usersContoller.post('/login', validationMiddleware(validation.SignInSchema), usersServices.userLogin)
usersContoller.patch('/update', authenticationMiddleware, usersServices.updateUser)
usersContoller.delete('/deleteUser', authenticationMiddleware, usersServices.deleteUser)
usersContoller.get('/userData', authenticationMiddleware, usersServices.getUserData)
usersContoller.put('/confirmation', usersServices.confirmationEmailService)
usersContoller.post('/refreshToken', usersServices.refreshTokenService)
usersContoller.post('/forgetPassword', validationMiddleware(validation.ForgetPasswordSchema), usersServices.forgetPassword)
usersContoller.put('/resetPassword', validationMiddleware(validation.ResetPasswordSchema), usersServices.resetPassword)
usersContoller.put('/updatePassword', authenticationMiddleware, validationMiddleware(validation.UpdatePasswordSchema), usersServices.updatePassword)
usersContoller.get('/getAllUsers', authorizationMiddleware([RolesEnum.SUPER_ADMIN]), usersServices.getAllUsers)


usersContoller.post('/logout', authenticationMiddleware, usersServices.LogoutService);
usersContoller.post('/auth-gmail', usersServices.AuthServiceWithGmail)
usersContoller.post('/upload-profile-host', authenticationMiddleware, hostUpload({}).single('profile'), usersServices.UploadProfileService)

export default usersContoller;