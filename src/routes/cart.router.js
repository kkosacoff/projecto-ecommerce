import { Router } from 'express'
import ProductManager from '../ProductManager.js'
import CartManager from '../CartManager.js'
const pm1 = new ProductManager('/products.json')
const cm1 = new CartManager('/carts.json')

const router = Router()

// Create cart
router.post('/', async (req, res) => {
  try {
    await cm1.createCart()
    res.send({ status: 'Success', msg: 'Cart created successfully' })
  } catch {
    res.send({ status: 'Error', msg: 'Cart could not be created' })
  }
})

// Query cart by ID
router.get('/:cid', async (req, res) => {
  const cart = await cm1.getCartById(req.params.cid)
  console.log(cart)

  if (cart) {
    res.send({ status: 'Success', msg: cart })
  } else {
    res.send({
      status: 'Error',
      msg: `Cart ${req.params.cid} could not be found`,
    })
  }
})

// Add product to cart by ID
router.post('/:cid/products/:pid', async (req, res) => {
  const addProd = await cm1.addProductToCartById(
    req.params.cid,
    req.params.pid,
    req.body.quantity
  )

  if (addProd) {
    res.send({
      status: 'success',
      msg: `${req.body.quantity} units of product ${req.params.pid}, added to cart ${req.params.cid}`,
    })
  } else {
    res.send({ status: 'error', msg: 'Product could not be added' })
  }
})

export default router
