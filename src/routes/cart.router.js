import { Router } from 'express'
// import CartManager from '../services/fs/CartManager.js'
import CartManager from '../services/db/cart.services.js'

const cm1 = new CartManager('')

const router = Router()

// Create cart
router.post('/', async (req, res) => {
  try {
    const newCart = await cm1.createCart()
    res.send({
      status: 'Success',
      msg: `Cart ${newCart._id} created succesfully`,
    })
  } catch {
    res.send({ status: 'Error', msg: 'Cart could not be created' })
  }
})

// Query cart by ID
router.get('/:cid', async (req, res) => {
  const cart = await cm1.getCartById(req.params.cid)

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

// Clear products from Cart by ID
router.delete('/:cid', async (req, res) => {
  const deletedCart = await cm1.clearCart(req.params.cid)
  console.log(deletedCart)
  if (deletedCart) {
    res.send({
      status: 'Success',
      msg: `Cart ${req.params.cid} deleted successfuly`,
    })
  }
})

router.delete('/:cid/products/:pid', async (req, res) => {
  const newCart = await cm1.deleteProductInCartById(
    req.params.cid,
    req.params.pid
  )

  if (newCart) {
    res.send({
      status: 'Success',
      msg: `Product ${req.params.pid} deleted from cart ${req.params.cid} successfuly`,
    })
  } else {
  }
})

export default router
