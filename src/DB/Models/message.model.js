import mongoose from 'mongoose';
const { Schema } = mongoose;

const messageSchema = new Schema({
  content :{
    type:String,
    require:true
  },
  receiverId:{
    type:Schema.Types.ObjectId, ref:'User',
    require:true
  },
  isPublic: {
    type: Boolean,
    default: false,
  }
},
{
  timestamps:true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;