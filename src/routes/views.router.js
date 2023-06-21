import { Router } from 'express'
import cookieParser from 'cookie-parser'
import checkRole from '../services/middlewares/check-role.js'

const router = Router()

router.use(cookieParser('HOLACOMO26323'))

router.get('/chat', checkRole('User'), async (req, res) => {
  res.render('chat')
})

router.get('/adminProducts', checkRole('Admin'), async (req, res) => {
  res.render('adminProducts')
})

// Product List and Add to Cart
router.get('/products', checkRole('User'), async (req, res) => {
  const resp = await fetch(`http://localhost:9090/api${req.url}`)
  const jsonData = await resp.json()

  jsonData.prevLink = jsonData.prevLink.replaceAll('api', '')
  jsonData.nextLink = jsonData.nextLink.replaceAll('api', '')
  console.log(req.session.user)

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
router.get('/cart/:cid', checkRole('User'), async (req, res) => {
  const resp = await fetch(`http://localhost:9090/api/carts/${req.params.cid}`)
  const jsonData = await resp.json()
  const products = jsonData.msg.products
  res.render('cartView', { productsInCart: products })
})

router.get('/ticket/:tid', checkRole('User'), async (req, res) => {
  const resp = await fetch(
    `http://localhost:9090/api/tickets/${req.params.tid}`
  )
  const jsonData = await resp.json()
  console.log('View Data')
  console.log(jsonData)
  res.render('ticketView', { data: jsonData })
})

export default router
