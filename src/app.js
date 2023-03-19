import express from 'express'
import productsRouter from '../src/routes/products.router.js'
import cartRouter from '../src/routes/cart.router.js'

const app = express()
const PORT = 8081

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
