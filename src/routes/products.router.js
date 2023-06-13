import { Router } from 'express'

// import ProductManager from '../services/fs/ProductManager.js'
// import ProductManager from '../services/db/product.services.js'

import ProductController from '../controllers/product.controller.js'

const pc = new ProductController()

const router = Router()

// Endpoint for showing all products
router.get('/', pc.getProductsController)

// Endpoint that allows to query by path by product ID
router.get('/:pid', pc.getProductByIdController)

// Endpoint for posting/creating a new product
router.post('/', pc.addProductController)

// Endpoint that allows to update by product ID
router.put('/:pid', pc.updateProductByIdController)

// Endpoint that allows to delete by product ID
router.delete('/:pid', pc.deleteProductByIdController)

export default router
