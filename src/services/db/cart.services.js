import cartsModel from './models/carts.js'

export default class CartManager {
  constructor() {
    this.carts = [] // initialize empty array
  }

  // Class Methods

  createCart = async () => {
    const newCart = await cartsModel.create({})
    return newCart
  }

  getCartById = async (id) => {
    const cart = cartsModel.findById(id)
    return cart ? cart : ''
  }

  addProductToCartById = async (cartId, prodId, quantity) => {
    const cart = await cartsModel.findById({ _id: cartId })

    if (cart) {
      const productAlreadyInCart = cart.products.some((item) => {
        if (item.product._id.toString() == prodId) {
          return true
        } else {
          return false
        }
      })
      // console.log(productAlreadyInCart)
      if (!productAlreadyInCart) {
        cart.products.push({ product: prodId, quantity: quantity })
      } else {
        cart.products = cart.products.map((product) => {
          if (product.product._id.toString() == prodId) {
            return { ...product, quantity: product.quantity + quantity }
          } else {
            return product
          }
        })
      }
      let result = await cartsModel.updateOne({ _id: cartId }, cart)
      return cart, result
    } else {
      console.log(`Cart ${cartId} couldn't be found`)
      return false
    }
  }

  deleteProductInCartById = async (cartId, prodId) => {
    let cart = await cartsModel.findById({ _id: cartId })

    if (cart) {
      cart.products = cart.products.filter(
        (product) => product.product._id.toString() != prodId
      )
      console.log(cart)

      let result = await cartsModel.updateOne({ _id: cartId }, cart)

      return result
    } else {
      console.log(`Cart ${cartId} couldn't be found`)
      return false
    }
  }

  clearCart = async (id) => {
    const newCart = await cartsModel.findById({ _id: id })
    newCart.products = []
    const result = await cartsModel.updateOne({ _id: id }, newCart)
    if (result) {
      console.log(`Products deleted from Cart ${id}`)
      return true
    } else {
      console.log(`Products couldn't be deleted`)
      return false
    }
  }
}
