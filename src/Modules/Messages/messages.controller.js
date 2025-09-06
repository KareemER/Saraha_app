import { Router } from "express";
import * as messagesServices from "./messages.service.js"
const messageController = Router()

messageController.post('/sendMessage/:receiverId',messagesServices.sendMessageService)

export default messageController