import User from "../../DB/Models/user.model.js";
import Message from "../../DB/Models/message.model.js";

export const sendMessageService = async (req,res) => {
    const {content} = req.body;
    const {receiverId} = req.params;
    const receiver = await User.findById(receiverId)
    if(!receiver){
        return res.status(404).json({message:"Receiver not found"})
    }
    const message = new Message({
        content,
        receiverId
    })

    await message.save()
    return res.status(201).json({message:"Message sent successfully"})
}