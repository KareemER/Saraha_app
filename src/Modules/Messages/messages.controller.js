import { Router } from "express";
import * as messagesServices from "./messages.service.js"
import { authenticationMiddleware } from "../../Middlewares/authentication.middleware.js";
const messageController = Router()

messageController.post('/sendMessage/:receiverId',messagesServices.sendMessageService)
messageController.get('/get-messages-one-user' , authenticationMiddleware , messagesServices.getMessagesService)
messageController.get("/getAll-message", messagesServices.getAllPublicMessageService);

export default messageController