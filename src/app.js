// Import outside modules
import express from 'express'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'

// Import routers
import productsRouter from '../src/routes/products.router.js'
import cartRouter from '../src/routes/cart.router.js'
import viewsRouter from '../src/routes/views.router.js'

// Import utils
import __dirname from './utils.js'

// Import services
import ProductManager from './services/ProductManager.js'
const pm = new ProductManager('/products.json')

// Configure server
const app = express()
const PORT = 8081

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
app.use('/home', viewsRouter)

// Activate server
const httpServer = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

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
    await pm.deleteProductById(prodId)
    socket.emit('removeProductFromList', prodId)
  })

  // on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
