import { Router } from 'express'
import cookieParser from 'cookie-parser'
import checkRole from '../services/middlewares/check-role.js'
import checkPermission from '../services/middlewares/check-permission.js'
import UserController from '../controllers/user.controller.js'
import ProductController from '../controllers/product.controller.js'
import ViewController from '../controllers/view.controller.js'
import fetch from 'node-fetch'

const uc = new UserController()
const pc = new ProductController()
const vc = new ViewController()

const router = Router()

router.use(cookieParser('HOLACOMO26323'))

router.get('/chat', checkRole('User'), async (req, res) => {
  res.render('chat')
})

// Admin Products

router.get(
  '/adminProducts',
  checkPermission('view_admin_product'),
  vc.getProductsControllerView
)

// Admin Users
router.get(
  '/adminUsers',
  checkPermission('view_admin_product'),
  vc.getUsersView
)

// Product List and Add to Cart
router.get('/products', checkPermission('view_product'), async (req, res) => {
  const baseUrl = `http://${req.headers.host}/`
  const resp = await fetch(`${baseUrl}api${req.url}`)
  const jsonData = await resp.json()

  jsonData.prevLink = jsonData.prevLink.replaceAll('/api', '')
  jsonData.nextLink = jsonData.nextLink.replaceAll('/api', '')

  res.render('productPage', {
    productArray: jsonData.payload,
    hasPrevPage: jsonData.hasPrevPage,
    hasNextPage: jsonData.hasNextPage,
    prevLink: jsonData.prevLink,
    nextLink: jsonData.nextLink,
    user: req.session.user,
  })
})

// Cart
router.get('/cart/:cid', async (req, res) => {
  const baseUrl = `http://${req.headers.host}`
  const resp = await fetch(`${baseUrl}/api/carts/${req.params.cid}`)
  const jsonData = await resp.json()
  console.log(jsonData)
  const products = jsonData.payload.products
  res.render('cartView', { productsInCart: products })
})

// Ticket
router.get('/ticket/:tid', async (req, res) => {
  const baseUrl = `http://${req.headers.host}`
  const resp = await fetch(`${baseUrl}/api/tickets/${req.params.tid}`)
  const jsonData = await resp.json()

  res.render('ticketView', { data: jsonData })
})

export default router
