import User from "../../DB/Models/user.model.js";
import Message from "../../DB/Models/message.model.js";

export const sendMessageService = async (req, res) => {
    const { content, isPublic } = req.body;
    const { receiverId } = req.params;
    const receiver = await User.findById(receiverId)
    if (!receiver) {
        return res.status(404).json({ message: "Receiver not found" })
    }
    const message = new Message({
        content,
        receiverId,
        isPublic
    })

    await message.save()
    const statusMessage = message.isPublic ? "Message is public" : "Message is private"
    return res.status(201).json({ message: "Message sent successfully", statusMessage, message })
}

export const getMessagesService = async (req, res) => {
    const { _id } = req.loggedInUser;
    const message = await Message.find({ receiverId: _id })
        .populate([
            {
                path: "receiverId"
            }
        ])
    if (!message.length) {
        return res.status(404).json({ message: "No messages found for this user" });

    }
    return res.status(201).json({ message })
}

export const getAllPublicMessageService = async (req, res) => {
    const publicMessage = await Message.find({ isPublic: true }).populate("receiverId", "firstName lastName");
    if (!publicMessage) {
        return res.status(404).json({ message: "Public message not found" })
    }
    return res.status(201).json({ message: "All public messages fetched successfully ", publicMessage })
}