import { Router } from 'express'
import ProductController from '../controllers/product.controller.js'
import checkRole from '../services/middlewares/check-role.js'
import checkPermission from '../services/middlewares/check-permission.js'
import { upload } from '../utils.js'

const router = Router()
const pc = new ProductController()

// Generate mock products
router.get('/mockingproducts', pc.getMockProducts)

// Endpoint for showing all products
router.get('/', pc.getProductsController)

// Endpoint for showing all products for admin
router.get('/admin', pc.getProductsAdminController)

// Endpoint that allows to query by path by product ID
router.get('/:pid', pc.getProductByIdController)

// Endpoint for posting/creating a new product
const uploadFields = [{ name: 'product', maxCount: 1 }]
router.post(
  '/',
  upload.fields(uploadFields),
  checkPermission('create_product'),
  pc.addProductController
)

// Endpoint that allows to update by product ID
router.put(
  '/:pid',
  checkPermission('update_product'),
  pc.updateProductByIdController
)

// Endpoint that allows to delete by product ID
router.delete(
  '/:pid',
  checkPermission('delete_product'),
  pc.deleteProductByIdController
)

export default router
