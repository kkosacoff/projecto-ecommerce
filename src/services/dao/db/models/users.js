import mongoose from 'mongoose'

const collection = 'users'
const schema = mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    age: Number,
    password: String,
    role: {
      type: String,
      enum: ['User', 'Admin'],
      default: 'User',
    },
    loggedBy: String,
  },
  { timestamps: true }
)
const userModel = mongoose.model(collection, schema)
export default userModel
