// Import outside modules
import path from 'path'
import express from 'express'
import { engine } from 'express-handlebars'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import config from './config/config.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'
import exphbs from 'express-handlebars'

// Import routers
import productsRouter from '../src/routes/products.router.js'
import cartRouter from '../src/routes/cart.router.js'
import ticketRouter from '../src/routes/tickets.router.js'
import viewsRouter from '../src/routes/views.router.js'
import sessionsRouter from '../src/routes/sessions.router.js'
import userViewsRouter from '../src/routes/users.views.router.js'
import emailRouter from '../src/routes/email.router.js'
import userRouter from '../src/routes/users.router.js'

// Import utils
import __dirname from './utils.js'

// import config
import initializePassport from './config/passport.config.js'

// Import services
import ProductManager from './services/dao/db/services/product.services.js'

const pm = new ProductManager()

// Configure server
const app = express()
const PORT = 9090

/*=============================================
=                   Middlewares               =
=============================================*/

// ? Swagger Config
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'API Documentation for E-Commerce Project',
      description:
        'This documentation describes the API endpoints used for the final project of Coderhouse backend course',
    },
  },
  apis: [`./src/docs/**/*.yaml`],
}

// creamos el specs
const specs = swaggerJSDoc(swaggerOptions)
// Declamos swagger API - endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))

// ? Looger
const logger = config.logger
app.use(logger)

// Logger Test
// Define some routes for testing
app.get('/loggerTest', (req, res) => {
  // Testing logger
  const logger = req.logger
  logger.debug('This is a debug message')
  logger.http('This is a http message')
  logger.info('This is an info message')
  logger.warning('This is a warning message')
  logger.error('This is an error message')
  logger.fatal('This is a fatal message')

  res.send('Logger test completed, check your console and log files')
})

// ? Sessions
app.use(
  session({
    //ttl: Time to live in seconds,
    //retries: Reintentos para que el servidor lea el archivo del storage.
    //path: Ruta a donde se buscará el archivo del session store.
    // store: new fileStore({path:"./sessions", ttl:40, retries: 0}),
    store: MongoStore.create({
      mongoUrl: config.mongoUrl,
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

// ? Enable endpoints to accept JSON requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Carpeta public
app.use(express.static(__dirname + '/public/'))

// ? Make session data available in all hbs views
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
// Set up folder for uploads
let uploadFolder = path.join(__dirname, '../uploads/')
console.log(uploadFolder)
app.use(express.static(uploadFolder))
app.use(express.static('uploads'))

//Handlebars set-up
const hbs = exphbs.create({
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2
    },
    log: function (something) {
      console.log(something)
    },
  },
})

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Configure routes
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/tickets', ticketRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', userRouter)
app.use('/', viewsRouter)
app.use('/users', userViewsRouter)
app.use('/email', emailRouter)

app.get('/', (req, res) => {
  if (!req.session.user) {
    res.redirect('/users/login')
  } else {
    res.redirect('/products')
  }
})

// Activate server
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

/*=============================================
=                   Mongo                   =
=============================================*/

// const connectMongoDB = async () => {
//   try {
//     await mongoose.connect(config.mongoUrl)
//     console.log('Conectado con exito a MongoDB usando Moongose.')
//   } catch (error) {
//     console.error('No se pudo conectar a la BD usando Moongose: ' + error)
//     process.exit()
//   }
// }
// connectMongoDB()

// const mongoInstance = async () => {
//   try {
//     await MongoSingleton.getInstance()
//   } catch (error) {
//     console.error(error)
//   }
// }
// mongoInstance()

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
    socket.emit('updateProductList', product)
  })

  socket.on('deleteProduct', async (prodId) => {
    socket.emit('removeProductFromList', prodId)
  })

  //Chat
  const logs = []
  //Message2 se utiliza para la parte de almacenar y devolver los logs completos.
  socket.on('message2', (data) => {
    logs.push({ socketid: socket.id, message: data })
    socketServer.emit('log', { logs })
  })

  // on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
