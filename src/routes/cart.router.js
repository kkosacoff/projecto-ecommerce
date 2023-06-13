import { Router } from 'express'
import CartController from '../controllers/cart.controller.js'

const cc = new CartController()

const router = Router()

// Create cart
router.post('/', cc.createCartController)

// Query cart by ID
router.get('/:cid', cc.getCartByIdController)

// Add product to cart by ID
router.post('/:cid/products/:pid', cc.addProductToCartByIdController)

// Clear products from Cart by ID
router.delete('/:cid', cc.clearCartController)

// Delete product in cart by ID
router.delete('/:cid/products/:pid', cc.deleteProductInCartByIdController)

// Purchase items from cart
router.post('/:cid/purchase', cc.purchaseCartController)

// User add to cart
router.post('/add-to-cart', cc.userAddToCartController)

export default router
