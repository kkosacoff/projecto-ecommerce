import { productService } from '../services/factory.js'
import UserManager from '../services/dao/db/services/user.services.js'

const persistenceFactory = productService

const um = new UserManager()

export default class ViewController {
  getProductsControllerView = async (req, res) => {
    const baseUrl = `http://${req.headers.host}/api/products`
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

    console.log(respObj)

    if (products) {
      res.render('adminProducts', {
        productArray: respObj.payload,
        user: req.session.user,
      })
    } else {
      res.send({ msg: `Couldn't get products` }).status(400)
    }
  }

  getUsersView = async (req, res) => {
    const users = await um.getAll()
    console.log(users)
    res.render('userList', {
      users: users,
    })
  }
}
