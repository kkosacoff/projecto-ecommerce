import UserManager from '../services/dao/db/services/user.services.js'
import transporter from './email.controller.js'
import crypto from 'crypto'
import { isValidPassword, createHash } from '../utils.js'
import {
  pathConverter,
  toRelativeURL,
} from '../services/middlewares/pathConverter.js'
import UserDTO from '../services/dto/users.dto.js'

const um = new UserManager()

export default class UserController {
  forgetPassController = async (req, res) => {
    const user = await um.getUserByEmail(req.body.email)
    if (!user) {
      // Handle user not found
      return res.status(404).json({ error: 'User not found.' })
    }

    // Generate password reset token
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 3600000 // 1 hour

    await user.save()

    // Set up email
    // const transporter = nodemailer.createTransport({ /* Your email configuration */ });
    const mailOptions = {
      to: user.email,
      from: 'kikosacoff@gmail.com',
      subject: 'Password Reset',
      text: `Please click on the following link, or paste this into your browser to complete the process: 
        http://${req.headers.host}/users/reset/${user.resetPasswordToken}`,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    res.status(200).json({ message: 'Email sent.' })
  }

  restorePassController = async (req, res) => {
    const user = await um.getUserByToken(req.params.token)

    if (!user) {
      // Handle token not found or expired
      return res
        .status(400)
        .json({ error: 'Reset token is invalid or has expired.' })
    }

    // Check if the new password is the same as the old password

    const isSamePassword = isValidPassword(user, req.body.password)

    if (isSamePassword) {
      return res
        .status(400)
        .json({ error: 'New password cannot be the same as the old password.' })
    }

    // Save the new password
    user.password = createHash(req.body.password)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    // Optionally, log the user in
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/users/login') // or wherever you want to redirect the user to
    })
  }

  changeUserRole = async (req, res) => {
    try {
      const userId = req.params.uid
      const user = await um.getUserById(userId)

      if (!user) {
        return res.status(404).send({ status: 'error', msg: 'User not found' })
      }

      // Check if user has uploaded the required documents
      const requiredDocuments = [
        'national_id',
        'proof_of_address',
        'bank_statement',
      ]
      const userDocumentNames = user.documents.map((doc) => doc.documentType)

      const allDocumentsPresent = requiredDocuments.every((doc) =>
        userDocumentNames.includes(doc)
      )

      if (!allDocumentsPresent && user.role == 'User') {
        return res
          .status(400)
          .send({ message: 'All required documents have not been uploaded' })
      }

      const changeUser = await um.changeUserRole(userId)

      if (changeUser) {
        res.status(200).send({
          status: 'success',
          payload: changeUser,
        })
      } else {
        return res
          .status(400)
          .send({ status: 'error', msg: 'User could not be changed' })
      }
    } catch (error) {
      res.status(500).send({ message: 'Server error', error })
    }
  }

  adminChangeUserRole = async (req, res) => {
    try {
      const userId = req.params.uid
      const role = req.body.role
      console.log(role)
      const user = await um.getUserById(userId)

      if (!user) {
        return res.status(404).send({ status: 'error', msg: 'User not found' })
      }

      const changeUser = await um.changeUserRoleAdmin(userId, role)

      if (changeUser) {
        res.status(200).send({
          status: 'success',
          payload: changeUser,
        })
      } else {
        return res
          .status(400)
          .send({ status: 'error', msg: 'User could not be changed' })
      }
    } catch (error) {
      res.status(500).send({ message: 'Server error', error })
    }
  }

  getUserByTokenController = async (req, res) => {
    try {
      const user = um.getUserByToken(req.params.token)

      if (!user) {
        // Handle token not found or expired
        return res
          .status(400)
          .json({ error: 'Reset token is invalid or has expired.' })
      }

      res.render('passwordRestore', { token: req.params.token })
    } catch (error) {
      res.status(500).send({ message: 'Server error', error })
    }
  }

  uploadDocuments = async (req, res) => {
    try {
      const userId = req.params.uid
      const user = await um.getUserById(userId)

      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      if (req.files.profile) {
        const profileImage = req.files.profile[0]
        // Handle the profile image, e.g., save its path to user's profile
        user.documents.push({
          name: profileImage.originalname,
          reference: pathConverter(profileImage.path),
          documentType: 'profile_picture',
        })
      }

      if (req.files.national_id) {
        const documentFile = req.files.national_id[0]
        // Handle the document, e.g., add it to the user's documents array
        user.documents.push({
          name: documentFile.originalname,
          reference: pathConverter(documentFile.path),
          documentType: 'national_id',
        })
      }

      if (req.files.proof_of_address) {
        const documentFile = req.files.proof_of_address[0]
        // Handle the document, e.g., add it to the user's documents array
        user.documents.push({
          name: documentFile.originalname,
          reference: pathConverter(documentFile.path),
          documentType: 'proof_of_address',
        })
      }

      if (req.files.bank_statement) {
        const documentFile = req.files.bank_statement[0]
        // Handle the document, e.g., add it to the user's documents array
        user.documents.push({
          name: documentFile.originalname,
          reference: documentFile.path,
          documentType: 'bank_statement',
        })
      }

      if (req.files.product) {
        const productImage = req.files.product[0]
        user.documents.push({
          name: productImage.originalname,
          reference: pathConverter(productImage.path),
        })
      }

      await user.save()

      return res.redirect(`/users/${userId}/upload`)
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: 'Server error' })
    }
  }

  renderUpload = async (req, res) => {
    try {
      const userId = req.params.uid
      const user = await um.getUserById(userId)

      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      res.render('uploadDocs', { user: req.session.user })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: 'Server error' })
    }
  }

  getDocuments = async (req, res) => {
    try {
      const userId = req.params.uid
      const user = await um.getUserById(userId)

      if (!user) {
        return res.status(404).send({ message: 'User not found' })
      }

      const profilePictureDocument = user.documents.find((doc) => {
        if (doc.documentType === 'profile_picture') {
          return doc
        }
      })

      const profileImagePath = profilePictureDocument
        ? profilePictureDocument.reference
        : null

      return res.json({
        documents: user.documents,
        profileImagePath: profilePictureDocument ? profileImagePath : null,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: 'Server error' })
    }
  }

  getUsers = async (req, res) => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)

    try {
      const users = await um.getAll()
      const dtoUsers = users.map((user) => {
        return new UserDTO(user)
      })
      if (dtoUsers) {
        res.status(200).send({
          status: 'success',
          payload: dtoUsers,
          dateCompared: twoDaysAgo,
        })
      } else {
        res.status(400).send({ status: 'error', msg: 'Cannot get users' })
      }
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: 'Server error' })
    }
  }

  deleteUsers = async (req, res) => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)

    // Find users who have been offline for the last 2 days
    const usersToDelete = await um.getAll({
      lastConnection: { $lt: twoDaysAgo },
    })

    // Send an email to each user and delete them
    for (const user of usersToDelete) {
      await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: user.email,
        subject: 'Account Deleted due to Inactivity',
        text: 'Your account has been deleted due to 2 days of inactivity.',
      })

      await user.remove()
    }

    res.send(`Deleted ${usersToDelete.length} users.`)
  }

  deleteUserById = async (req, res) => {
    try {
      const deletedUser = await um.deleteUserById(req.params.uid)
      if (deletedUser) {
        res.status(200).send({
          status: 'success',
          msg: `User ${req.params.uid} deleted`,
          payload: deletedUser,
        })
      }
    } catch (err) {
      res.send(err)
    }
  }
}
