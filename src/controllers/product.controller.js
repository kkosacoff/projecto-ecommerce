import { productService } from '../services/factory.js'
import { generateProduct } from '../utils.js'
import transporter from './email.controller.js'
import { pathConverter } from '../services/middlewares/pathConverter.js'

const persistenceFactory = productService

// 'http://localhost:9090/api/products'

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
    const jsonData = JSON.parse(req.body.formProduct)

    const { title, description, code, price, status, stock, category } =
      jsonData
    const thumbnails = []

    if (req.files.product) {
      const productImage = req.files.product[0]
      thumbnails.push({
        name: productImage.originalName,
        reference: pathConverter(productImage.path),
      })
    }

    const newProd = await persistenceFactory.addProduct({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      owner: req.session.user.id,
      thumbnails,
    })

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
    const baseUrl = ` http://${req.headers.host}/api/products`
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

  getProductsAdminController = async (req, res) => {
    const products = await persistenceFactory.getProducts()

    if (products) {
      res
        .send({
          msg: 'success',
          payload: products,
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
    try {
      const product = await persistenceFactory.getProductById(req.params.pid)
      const user = req.session.user

      if (product.owner._id != user.id && user.role == 'Premium') {
        res.status(400).send({
          status: 'error',
          msg: 'Premium User cannot delete other owned products',
        })
      } else {
        const deleteProd = await persistenceFactory.deleteProductById(
          req.params.pid
        )
        if (product.owner.role == 'Premium' && deleteProd) {
          const mailOptions = {
            to: product.owner.email,
            from: 'kikosacoff@gmail.com',
            subject: `Product ${req.params.pid} deleted`,
            text: `Product ${req.params.pid} has been deleted. Contact the admin for more information`,
          }

          // Send email
          await transporter.sendMail(mailOptions)
        }
        res.status(201).send({
          status: 'success',
          msg: `Product ${req.params.pid} deleted successfully`,
        })
      }
    } catch {
      res.status(400).send('Error')
      throw new Error()
    }
  }
}
