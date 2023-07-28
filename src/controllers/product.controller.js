import { productService } from '../services/factory.js'
import { generateProduct } from '../utils.js'

const persistenceFactory = productService
const baseUrl = 'http://localhost:9090/api/products'

export default class ProductController {
  getMockProducts = async (req, res) => {
    try {
      let products = []
      for (let i = 0; i < 100; i++) {
        products.push(generateProduct())
      }
      res.send({ status: 'success', payload: products })
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: error, message: 'Cannot get products' })
    }
  }

  addProductController = async (req, res) => {
    const newProd = await persistenceFactory.addProduct(req.body)

    if (newProd) {
      res.status(201).send({
        status: 'success',
        msg: `Product ${newProd.code} created successfully`,
        payload: newProd,
      })
    } else {
      res
        .send({
          status: 'error',
          msg: `Product couldn't be created`,
        })
        .status(400)
    }
  }

  getProductsController = async (req, res) => {
    const newUrl = new URL(`${baseUrl}${req.url}`)

    const products = await persistenceFactory.getProductsNew(
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
      res
        .send({
          msg: 'success',
          ...respObj,
        })
        .status(200)
    } else {
      res.send({ msg: `Couldn't get products` }).status(400)
    }
  }

  getProductByIdController = async (req, res) => {
    const product = await persistenceFactory.getProductById(req.params.pid)
    if (product) {
      res
        .send({
          status: 'success',
          payload: product,
        })
        .status(201)
    } else {
      res
        .send({
          msg: `Product ID ${req.params.pid} not found`,
          status: 'error',
        })
        .status(400)
    }
  }

  updateProductByIdController = async (req, res) => {
    const updatedProd = await persistenceFactory.updateProductById(
      req.params.pid,
      req.body
    )
    if (updatedProd) {
      res
        .send({
          status: 'success',
          msg: `Product ${req.params.pid} updated successfully`,
          payload: updatedProd,
        })
        .status(201)
    } else {
      res
        .send({
          status: 'error',
          msg: `Product ${req.params.pid} doesn't exist`,
        })
        .status(400)
    }
  }

  deleteProductByIdController = async (req, res) => {
    persistenceFactory.deleteProductById(req.params.pid)
    res.send('Ok')
  }
}
