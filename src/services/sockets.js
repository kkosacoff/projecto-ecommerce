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
    await pm.deleteProductById(prodId)
    socket.emit('removeProductFromList', prodId)
  })

  // on disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})
