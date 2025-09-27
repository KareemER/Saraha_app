import { compareSync, hashSync } from "bcrypt";
import User from "../../DB/Models/user.model.js"
import { decrypt, encrypt } from "../../Utils/Encryption.utils.js";
import { generatedToken, verifyToken } from "../../Utils/Token.utils.js";
import { emitter } from "../../Utils/send-email.utils.js";
import { customAlphabet } from "nanoid";
const confirmationCode = customAlphabet('qwertyuioasdfghjkxcvbnm78416', 6);

export const userSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, age } = req.body;
        const isEmailExist = await User.findOne({ email })
        if (isEmailExist) {
            return res.status(409).json({ message: "Email already exists" })
        }
        const encryptedPhone = encrypt(phone);
        const hashedPassword = hashSync(password, +process.env.SALT_ROUNDS);
        const otp = confirmationCode();
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone: encryptedPhone,
            age,
            otps: { confirmation: hashSync(otp, +process.env.SALT_ROUNDS) }
        });
        await user.save();
        emitter.emit('sendEmail', {
            to: email,
            subject: "confirmation email",
            content: `<h1>Thank you for signing up to our app</h1>
            <p>Your confirmation OTP is ${otp}</p>
            <a href="https://freecatphotoapp.com">Confirm</a>`
        })
        return res.status(201).json({ message: "User created successfully", firstName, lastName, email, phone: decrypt(encryptedPhone), age })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

export const confirmationEmailService = async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, isConfirmed: false })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    const isOtpMatched = compareSync(otp, user.otps?.confirmation)
    if (!isOtpMatched) {
        return res.status(401).json({ message: "Invalid OTP" })
    }
    user.isConfirmed = true;
    user.otps.confirmation = null;
    await user.save();
    return res.status(200).json({ message: "User confirmed successfully" })
}

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: "Invalid login credentials " })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid login credentials " })
        }
        const isPasswordMatched = compareSync(password, user.password)
        if (!isPasswordMatched) {
            return res.status(401).json({ message: "Invalid login credentials " })
        }
        const accesstoken = generatedToken(
            { id: user._id, email: user.email },
            process.env.JWT_ACCESS_SECERET_KEY,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
        )
        const refreshtoken = generatedToken(
            { id: user._id, email: user.email },
            process.env.JWT_REFRESH_SECERET_KEY,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }

        )
        return res.status(200).json({ message: "User logged in successfully", accesstoken, refreshtoken })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

export const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, age } = req.body;
        const updatedData = {}
        if (email) {
            const isEmailExist = await User.findOne({ email })
            if (isEmailExist) {
                return res.status(409).json({ message: "Email already exists" })
            }
        }
        else {
            updatedData.email = email
        }
        if (firstName) updatedData.firstName = firstName
        if (lastName) updatedData.lastName = lastName
        if (age) updatedData.age = age

        if (phone) {
            const encryptedPhone = encrypt(phone);
            updatedData.phone = encryptedPhone;
        }
        await User.findByIdAndUpdate(req.loggedInUser._id, updatedData, { new: true })
        return res.status(201).json({ message: "User updated successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.loggedInUser._id)
        return res.status(200).json({ message: "User deleted successfully, yala m3 el salama w el 2alb da3ilak" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

export const getUserData = async (req, res) => {
    try {
        const user = req.loggedInUser;
        return res.status(200).json({ message: "Data retrieved successfully", name: user.name, email: user.email, phone: decrypt(user.phone), age: user.age })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error })
    }
}

export const refreshTokenService = async (req, res) => {
    const { refreshtoken } = req.headers
    const decodedData = verifyToken(refreshtoken, process.env.JWT_REFRESH_SECERET_KEY)
    if (!decodedData) {
        return res.status(401).json({ message: "Invalid refresh token" })
    }
    const accesstoken = generatedToken(
        { id: decodedData._id, email: decodedData.email },
        process.env.JWT_ACCESS_SECERET_KEY,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
    )
    return res.status(200).json({ message: "Token refreshed successfully", accesstoken })
}

export const forgetPassword = async (req, res) => {

    const email = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" })
    const otp = confirmationCode();
    user.otps.resetPassword = hashSync(otp, +process.env.SALT_ROUNDS);
    await user.save();
    emitter.emit('sendEmail', {
        to: email,
        subject: "reset password email",
        content: `<h1>Thank you for signing up to our app</h1>
        <p>Your reset password OTP is ${otp}</p>
        <a href="https://freecatphotoapp.com">Confirm</a>`
    })
    return res.status(200).json({ message: "reset password OTP is sent to your email" })
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (oldPassword === newPassword) return res.status(400).json({ message: "New password cannot be the same as old password" })
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: "User not found" })
    const isOtpMatched = compareSync(otp, user.otps?.resetPassword)
    if (!isOtpMatched) return res.status(401).json({ message: "Invalid OTP" })
    user.password = hashSync(newPassword, +process.env.SALT_ROUNDS)
    user.otps.resetPassword = null
    await user.save()
    return res.status(200).json({ message: "Password reset successfully" })
}

export const updatePassword = async (req, res) => {
    const { _id: userId } = req.loggedInUser;
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId)
    if (oldPassword === newPassword) return res.status(400).json({ message: "New password cannot be the same as old password" })
    if (!user) return res.status(404).json({ message: "User not found" })
    const isPasswordMatched = compareSync(oldPassword, user.password)
    if (!isPasswordMatched) return res.status(401).json({ message: "Invalid password" })
    user.password = hashSync(newPassword, +process.env.SALT_ROUNDS)
    await user.save()
    return res.status(200).json({ message: "Password updated successfully" })
}

export const getAllUsers = async (req, res) => {
    const users = await User.find();
    return res.status(200).json({ message: "Users retrieved successfully", users })
}