import CartManager from '../services/dao/db/services/cart.services.js'
import TicketManager from '../services/dao/db/services/ticket.services.js'

const cm1 = new CartManager('')
const tm1 = new TicketManager()

export default class CartController {
  createCartController = async (req, res) => {
    try {
      const newCart = await cm1.createCart()
      res.send({
        status: 'Success',
        msg: `Cart ${newCart._id} created succesfully`,
        payload: newCart,
      })
    } catch {
      res.send({ status: 'Error', msg: 'Cart could not be created' })
    }
  }

  getCartByIdController = async (req, res) => {
    const cart = await cm1.getCartById(req.params.cid)

    if (cart) {
      res.send({ status: 'Success', msg: cart })
    } else {
      res.send({
        status: 'Error',
        msg: `Cart ${req.params.cid} could not be found`,
      })
    }
  }

  addProductToCartByIdController = async (req, res) => {
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
  }

  clearCartController = async (req, res) => {
    const deletedCart = await cm1.clearCart(req.params.cid)
    if (deletedCart) {
      res.send({
        status: 'Success',
        msg: `Cart ${req.params.cid} deleted successfuly`,
      })
    }
  }

  deleteProductInCartByIdController = async (req, res) => {
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
  }

  userAddToCartController = async (req, res) => {
    if (req.session.cart) {
      const prodAdded = await cm1.addProductToCartById(
        req.session.cart._id.toString(),
        req.body.prodId,
        req.body.quantity
      )
      if (prodAdded) {
        res.status(200).send({ status: 'success', payload: prodAdded })
      }
    }
  }

  purchaseCartController = async (req, res) => {
    const purchasedCart = await cm1.purchaseCart(req.params.cid)

    let total = purchasedCart.prodsToPurchase.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    )

    const newTicket = await tm1.createTicket(total, req.session.user.email)

    if (newTicket) {
      res
        .send({
          status: 'Success',
          msg: `Ticket ${newTicket} por un total de $ ${total} generado con exito. Fue enviado a ${newTicket.purchaser}`,
          payload: newTicket,
        })
        .status(200)
    } else {
      res
        .send({
          status: 'error',
        })
        .status(400)
    }
  }
}
