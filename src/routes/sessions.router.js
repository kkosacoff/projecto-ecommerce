import { Router } from 'express'
import passport from 'passport'
import CartManager from '../services/dao/db/cart.services.js'
import UserDTO from '../services/dto/user.dto.js'

const router = Router()
const cm = new CartManager()

//? Normal register
// router.post('/register', async (req, res) => {
//   const { first_name, last_name, email, age, password } = req.body
//   console.log('Registrando usuario...')

//   const exists = await userModel.findOne({ email })
//   if (exists) {
//     return res
//       .status(400)
//       .send({ status: 'error', message: 'Usuario ya existe.' })
//   }
//   const user = {
//     first_name,
//     last_name,
//     email,
//     age,
//     password: createHash(password), //se encriptara despues...
//   }
//   const result = await userModel.create(user)
//   req.session.user = result
//   res.status(201).send({
//     status: 'success',
//     message: 'Usuario creado con extito con ID: ' + result.id,
//   })
// })

//? Passport register
router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: '/failedRegister' }),
  async (req, res) => {
    res.send({ status: 'success', message: 'user registered' })
  }
)

router.get('/failedRegister', async (req, res) => {
  console.log('Failed strategy')
  res.send({ error: 'Failed' })
})
// ? ---

// ? Normal Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body
//   const user = await userModel.findOne({ email })
//   if (!user)
//     return res
//       .status(401)
//       .send({ status: 'error', error: 'Incorrect credentials' })

//   if (!isValidPassword(user, password)) {
//     return res
//       .status(401)
//       .send({ status: 'error', error: 'Incorrect credentials' })
//   }
//   delete user.password

//   req.session.user = {
//     name: `${user.first_name} ${user.last_name}`,
//     email: user.email,
//     age: user.age,
//   }
//   res.send({
//     status: 'success',
//     payload: req.session.user,
//     message: 'Login successful :)',
//   })
// })
// ? ---

// ? Passport login
router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/failedLogin' }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: 'error', error: 'Invalid Credentials' })

    const newUser = new UserDTO(req.user)
    const cart = await cm.createCart()
    req.session.cart = cart
    req.session.user = newUser

    console.log(req.session.cart)
    res.send({
      status: 'success',
      message: 'user logged in',
      payload: newUser,
    })
  }
)

router.get('failedLogin', async (req, res) => {
  console.log('Failed strategy')
  res.send({ error: 'Failed' })
})
// ? ---

router.get('/current', async (req, res) => {
  res.send({
    status: 'success',
    user: req.session.user,
    cart: req.session.cart,
  })
})

// ? Github login
// * Route to call from front-end, and it calls passport github middleware
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async (req, res) => {}
)

router.get(
  '/githubCallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async (req, res) => {
    const user = req.user
    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
    }
    res.redirect('/products')
  }
)
// ? ---

// destroy session
router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.json({ error: 'Error de logout', msg: 'Error al cerrar session' })
    }
    res.clearCookie('connect.sid').send('Sesion cerrada correctamente!!')
  })
})

export default router
