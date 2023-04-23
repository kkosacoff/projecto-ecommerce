import { Router } from 'express'
import url from 'node:url'
// import ProductManager from '../services/fs/ProductManager.js'
import ProductManager from '../services/db/product.services.js'

const pm1 = new ProductManager('/products.json')

const router = Router()

const baseUrl = 'http://localhost:9090/api/products'

// Endpoint for showing all products
router.get('/', async (req, res) => {
  const newUrl = new URL(`${baseUrl}${req.url}`)

  const products = await pm1.getProductsNew(
    req.query.limit,
    req.query.page,
    req.query.filter,
    req.query.sort
  )

  let prevLink = ''
  let nextLink = ''

  if (products.hasPrevPage) {
    newUrl.searchParams.set('page', products.prevPage)
    prevLink = newUrl.href
  }

  if (products.hasNextPage) {
    newUrl.searchParams.set('page', products.nextPage)
    nextLink = newUrl.href
  }

  const respObj = {
    payload: products.docs,
    totalPages: products.totalPages,
    prevPage: products.prevPage,
    nextPage: products.nextPage,
    page: products.page,
    hasPrevPage: products.hasPrevPage,
    hasNextPage: products.hasNextPage,
    prevLink: prevLink,
    nextLink: nextLink,
  }

  if (products) {
    res.send({
      msg: 'Success',
      ...respObj,
    })
  } else {
    res.send({ msg: `Couldn't get products` })
  }
})

// Endpoint that allows to query by path by product ID
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
      msg: `Product ${newProd.code} created successfully`,
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
