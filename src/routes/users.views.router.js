import { Router } from 'express'
import UserDTO from '../services/dto/user.dto.js'
const router = Router()

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

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

export default router
