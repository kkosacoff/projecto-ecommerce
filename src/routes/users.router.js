import { Router } from 'express'
import { upload } from '../utils.js'
import UserController from '../controllers/user.controller.js'
import checkPermission from '../services/middlewares/check-permission.js'
import userModel from '../services/dao/db/models/users.js'

const uc = new UserController()
const router = Router()

router.get('/test', async (req, res) => {
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  const usersToDelete = await userModel.find({
    lastConnection: { $lte: twoDaysAgo },
  })
  res.json(usersToDelete)
})

// ? Get all users
router.get('/', checkPermission('view_users'), uc.getUsers)

// ? Delete all users in last 2 days
router.delete('/', checkPermission('delete_users'), uc.deleteUsers)

// ? Delete individual user
router.delete('/:uid', uc.deleteUserById)

// ? Password forgot
router.post('/forgot', uc.forgetPassController)

// ? Password reset
router.post('/reset/:token', uc.restorePassController)

// ? Change user status
router.put('/premium/:uid', uc.changeUserRole)

// ? Admin change user status
router.put('/:uid', uc.adminChangeUserRole)

//? Send user documents
const uploadFields = [
  { name: 'profile', maxCount: 1 },
  { name: 'national_id', maxCount: 1 },
  { name: 'proof_of_address', maxCount: 1 },
  { name: 'bank_statement', maxCount: 1 },
  { name: 'product', maxCount: 1 },
]
router.post('/:uid/documents', upload.fields(uploadFields), uc.uploadDocuments)

// ? Get user documents
router.get('/:uid/documents', uc.getDocuments)

export default router
