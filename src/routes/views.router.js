import { Router } from 'express'
import ProductManager from '../services/ProductManager.js'

const router = Router()

const pm1 = new ProductManager('/products.json')

const products = await pm1.getProducts()

router.get('/', (req, res) => {
  res.render('home', { products })
})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', { products: await pm1.getProducts() })
})

export default router
