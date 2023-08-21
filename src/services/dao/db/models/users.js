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
      enum: ['User', 'Admin', 'Premium'],
      default: 'User',
    },
    loggedBy: String,
    documents: {
      type: [
        {
          name: {
            type: String,
            // required: true,
          },
          reference: {
            type: String,
            // required: true,
          },
          documentType: {
            type: String,
            // required: true,
            enum: [
              'profile_picture',
              'national_id',
              'proof_of_address',
              'bank_statement',
            ],
          },
        },
      ],
      default: [],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastConnection: {
      type: Date,
      // default: Date.now,
    },
    status: {
      type: String,
      enum: ['Verified', 'In Review', 'Rejected', 'Not Started'],
      default: 'Not Started',
    },
  },
  { timestamps: true }
)
const userModel = mongoose.model(collection, schema)
export default userModel
