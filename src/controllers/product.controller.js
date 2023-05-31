import ProductManager from '../services/db/product.services.js'
import url from 'node:url'

const pm = new ProductManager()

const baseUrl = 'http://localhost:9090/api/products'

export default class ProductController {
  addProductController = async (req, res) => {
    const newProd = await pm.addProduct(req.body)

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
  }

  getProductsController = async (req, res) => {
    const newUrl = new URL(`${baseUrl}${req.url}`)

    const products = await pm.getProductsNew(
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
  }

  getProductByIdController = async (req, res) => {
    const product = await pm.getProductById(req.params.pid)
    if (product) {
      res.send(product)
    } else {
      res.send({ msg: `Product ID ${req.params.pid} not found` })
    }
  }

  updateProductByIdController = async (req, res) => {
    const updatedProd = await pm.updateProductById(req.params.pid, req.body)
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
  }

  deleteProductByIdController = async (req, res) => {
    pm.deleteProductById(req.params.pid)
    res.send('Ok')
  }
}
