// Import outside modules
import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'

// Import routers
import productsRouter from '../src/routes/products.router.js'
import cartRouter from '../src/routes/cart.router.js'
import viewsRouter from '../src/routes/views.router.js'
import sessionsRouter from '../src/routes/sessions.router.js'
import userViewsRouter from '../src/routes/users.views.router.js'

// Import utils
import __dirname from './utils.js'

// import config
import initializePassport from './config/passport.config.js'

// Import services
import ProductManager from './services/db/product.services.js'
import CartManager from './services/db/cart.services.js'

const pm = new ProductManager()
const cm = new CartManager()

// Configure server
const app = express()
const PORT = 9090

const MONGO_URL =
  'mongodb://localhost:27017/ecommerce?retryWrites=true&w=majority'

// Middlewares

app.use(
  session({
    //ttl: Time to live in seconds,
    //retries: Reintentos para que el servidor lea el archivo del storage.
    //path: Ruta a donde se buscará el archivo del session store.
    // store: new fileStore({path:"./sessions", ttl:40, retries: 0}),
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 300,
    }),
    secret: 'CoderS3cret',
    resave: false,
    saveUninitialized: true,
  })
)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Enable endpoints to accept JSON requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Carpeta public
app.use(express.static(__dirname + '/public/'))

//Handlebars set-up
app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Configure routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/', viewsRouter)
app.use('/users', userViewsRouter)

// Activate server
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

/*=============================================
=                   Mongo                   =
=============================================*/

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL)
    console.log('Conectado con exito a MongoDB usando Moongose.')
  } catch (error) {
    console.error('No se pudo conectar a la BD usando Moongose: ' + error)
    process.exit()
  }
}
connectMongoDB()

/*=============================================
=                   Sockets                   =
=============================================*/

import { Server } from 'socket.io'
// Configure socket
const socketServer = new Server(httpServer)

socketServer.on('connection', (socket) => {
  // on connect
  console.log('Nuevo cliente conectado')

  socket.on('addProduct', async (product) => {
    const addProd = await pm.addProduct(product)
    if (addProd) {
      socket.emit('updateProductList', addProd)
    }
  })

  socket.on('deleteProduct', async (prodId) => {
    try {
      await pm.deleteProductById(prodId)
      socket.emit('removeProductFromList', prodId)
    } catch {
      throw new Error()
    }
  })

  socket.on('createCart', async () => {
    const newCart = await cm.createCart()
    console.log(newCart)
    socket.emit('clientCart', newCart)
  })

  socket.on('addToCart', async (cartId, prodId, quantity) => {
    const prodAddedToCart = await cm.addProductToCartById(
      cartId._id,
      prodId,
      quantity
    )
    console.log(prodAddedToCart)
  })

  // on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
