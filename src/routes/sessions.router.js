import { Router } from 'express'
import userModel from '../services/db/models/users.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body
  console.log('Registrando usuario...')

  const exists = await userModel.findOne({ email })
  if (exists) {
    return res
      .status(400)
      .send({ status: 'error', message: 'Usuario ya existe.' })
  }
  const user = {
    first_name,
    last_name,
    email,
    age,
    password, //se encriptara despues...
  }
  const result = await userModel.create(user)
  req.session.user = result
  res.status(201).send({
    status: 'success',
    message: 'Usuario creado con extito con ID: ' + result.id,
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email, password })
  if (!user)
    return res
      .status(401)
      .send({ status: 'error', error: 'Incorrect credentials' })

  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
  }
  res.send({
    status: 'success',
    payload: req.session.user,
    message: 'Login successful :)',
  })
})

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
