import mongoose from 'mongoose';
const { Schema } = mongoose;
import { GenderEnum, ProviderEnum, RolesEnum } from "../../Common/user.enum.js";

const userSchema = new Schema({
  firstName: {
    type: String,
    require: true,
    minLength: [3, 'First Name must be at least 3 characters long'],
    maxLength: [20, 'First Name must be at most 20 characters long'],
    lowercase: true,
    trim: true
  },
  lastName: {
    type: String,
    require: true,
    minLength: [3, 'Last Name must be at least 3 characters long'],
    maxLength: [20, 'Last Name must be at most 20 characters long'],
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    require: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  age: {
    type: Number,
    require: true,
    index: {
      name: 'indx_age'
    },
    min: [18, 'you must be older than 18, go touch some grass'],
    max: [60, 'What are you doing here? go spend time with your grandchildren']
  },
  gender: {
    type: String,
    enum: Object.values(GenderEnum),
    default: "rather not say"
  },
  otps: {
    confirmation: { type: String },
    resetPassword: { type: String }
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    emum: Object.values(RolesEnum)
  },
  provider: {
    type: String,
    enum: Object.values(ProviderEnum)
  }
},
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    },
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`
        }
      }
    }
  });

const User = mongoose.model('User', userSchema)
export default User