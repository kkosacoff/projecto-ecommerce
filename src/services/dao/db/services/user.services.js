import userModel from '../models/users.js'

export default class UserManager {
  constructor() {}

  // Class Methods

  createUser = async (
    first_name,
    last_name,
    email,
    age,
    password,
    role,
    loggedBy
  ) => {
    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role,
      loggedBy,
    })
    return newUser
  }

  getUserByEmail = async (email) => {
    const user = await userModel.findOne({ email: email })
    return user ? user : ''
  }

  getUserById = async (id) => {
    const user = await userModel.findById({ _id: id })
    return user ? user : ''
  }

  changeUserRole = async (id) => {
    // const userId = req.params.userId
    const user = await userModel.findById(id)

    if (!user) {
      return false
    }

    // Toggle role
    if (user.role === 'User') {
      user.role = 'Premium'
    } else {
      user.role = 'User'
    }

    const result = await user.save()

    return result
  }

  changeUserRoleAdmin = async (id, role) => {
    const user = await userModel.findOneAndUpdate({ _id: id }, { role: role })
    if (!user) {
      return false
    }

    const result = await user.save()
    if (result) {
      console.log(`User ${id} updated to ${role}`)
      return true
    } else {
      return false
    }
  }

  getUserByToken = async (token) => {
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    return user ? user : ''
  }

  getAll = async (filter) => {
    let users = await userModel.find(filter)
    return users.map((user) => user.toObject())
  }

  deleteUserById = async (id) => {
    const deletedUser = await userModel.deleteOne({ _id: id })

    if (deletedUser) {
      console.log(`User ${id} deleted`)
      return true
    } else {
      console.log(`User ${id} couldn't be deleted`)
      return false
    }
  }
}
