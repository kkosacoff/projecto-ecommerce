import { Router } from 'express'
import UserDTO from '../services/dto/user.dto.js'
const router = Router()
import checkPermission from '../services/middlewares/check-permission.js'
import UserController from '../controllers/user.controller.js'

const uc = new UserController()

router.get('/', (req, res) => {
  console.log(req.session.user)
  if (!req.session.user) {
    res.redirect('/users/login')
  } else {
    res.redirect('/products')
  }
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.get('/forgot', (req, res) => {
  res.render('passwordRecover')
})

router.get('/reset/:token', uc.getUserByTokenController)

// ? Current
router.get('/current', async (req, res) => {
  if (!req.user)
    return res
      .status(400)
      .send({ status: 'error', error: 'Invalid Credentials' })

  const user = new UserDTO(req.user)
  console.log(user)

  res.render('current', { user })
})

router.get('/:uid/upload', checkPermission('upload_docs'), uc.renderUpload)

export default router
