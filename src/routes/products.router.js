import { Router } from 'express'
import ProductManager from '../ProductManager.js'
const pm1 = new ProductManager('/products2.json')

const router = Router()

// Endpoint for showing all products
router.get('/', async (req, res) => {
  const products = await pm1.getProducts()
  if (req.query.limit) {
    res.send(products.slice(0, req.query.limit))
  } else {
    res.send(products)
  }
})

// Endpoint that allows to query by product ID
router.get('/:pid', async (req, res) => {
  const product = await pm1.getProductById(req.params.pid)
  if (product) {
    res.send(product)
  } else {
    res.send({ msg: `Product ID ${req.params.pid} not found` })
  }
})

// Endpoint for posting/creating a new product
router.post('/', async (req, res) => {
  const newProd = await pm1.addProduct(req.body)

  if (newProd) {
    res.send({
      status: 'Success',
      msg: `Product ${newProd.prodId} created successfully`,
    })
  } else {
    res.send({
      status: 'error',
      msg: `Product couldn't be created`,
    })
  }
})

// Endpoint that allows to update by product ID
router.put('/:pid', async (req, res) => {
  console.log(req.params)
  const updatedProd = await pm1.updateProductById(req.params.pid, req.body)
  if (updatedProd) {
    res.send({
      status: 'Success',
      msg: `Product ${req.params.pid} updated successfully`,
    })
  } else {
    res.send({
      status: 'error',
      msg: `Product ${req.params.pid} doesn't exist`,
    })
  }
})

// Endpoint that allows to delete by product ID
router.delete('/:pid', async (req, res) => {
  pm1.deleteProductById(req.params.pid)
  res.send('Ok')
})

export default router
