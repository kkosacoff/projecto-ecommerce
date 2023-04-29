import { Router } from 'express'
import cookieParser from 'cookie-parser'
// import ProductManager from '../services/fs/ProductManager.js'
import ProductManager from '../services/db/product.services.js'
import CartManager from '../services/db/cart.services.js'

const router = Router()

router.use(cookieParser('HOLACOMO26323'))

// const pm1 = new ProductManager()
// const cm = new CartManager()

// router.get('/', (req, res) => {
//   res.render('home', { products })
// })

// router.get('/realtimeproducts', async (req, res) => {
//   const products = await pm1.getProducts()
//   res.render('realTimeProducts', { productArray: products })
// })

// Product List and Add to Cart
router.get('/products', async (req, res) => {
  if (!req.session.user) {
    res
      .status(403)
      .render('error', { status: '403', msg: 'User not authorized' })
  } else {
    const resp = await fetch(`http://localhost:9090/api${req.url}`)
    const jsonData = await resp.json()

    jsonData.prevLink = jsonData.prevLink.replaceAll('api', 'home')
    jsonData.nextLink = jsonData.nextLink.replaceAll('api', 'home')

    res.render('productPage', {
      productArray: jsonData.payload,
      hasPrevPage: jsonData.hasPrevPage,
      hasNextPage: jsonData.hasNextPage,
      prevLink: jsonData.prevLink,
      nextLink: jsonData.nextLink,
      user: req.session.user,
    })
  }
})

// Cart
router.get('/cart/:cid', async (req, res) => {
  const resp = await fetch(`http://localhost:9090/api/carts/${req.params.cid}`)
  const jsonData = await resp.json()
  const products = jsonData.msg.products
  res.render('cartView', { productsInCart: products })
})

export default router
