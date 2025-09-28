import mongoose from "mongoose";

const revokedTokensSchema = new mongoose.Schema({
    tokenId : {
        type:String,
        required:true,
        unique:true
    },
    expirationDate : {
        type:Date,
        required:true
    }
});


const RevokedToken = mongoose.model("RevokedToken" , revokedTokensSchema)
export default RevokedToken