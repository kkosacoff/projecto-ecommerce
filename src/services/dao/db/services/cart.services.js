import cartsModel from '../models/carts.js'
import productsModel from '../models/products.js'

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
    const prod = await productsModel.findById({ _id: prodId })

    if (cart && prod && quantity) {
      const productAlreadyInCart = cart.products.some((item) => {
        if (item.product._id.toString() == prodId) {
          return true
        } else {
          return false
        }
      })
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
      console.log(`Cart ${cartId} or product ${prodId} couldn't be found`)
      return false
    }
  }

  deleteProductInCartById = async (cartId, prodId) => {
    let cart = await cartsModel.findById({ _id: cartId })

    if (cart) {
      cart.products = cart.products.filter(
        (product) => product.product._id.toString() != prodId
      )

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
      return true
    } else {
      return false
    }
  }

  calculateTotal = async (cartId) => {
    let cart = await cartsModel.findById({ _id: cartId })
    let total = 0
    cart.products.map((item) => {
      total = total + parseFloat(item.product.price) * parseFloat(item.quantity)
    })
    return total
  }

  purchaseCart = async (cartId) => {
    let cart = await cartsModel.findById({ _id: cartId })
    const purchaseObj = {
      outOfStockProducts: [],
      prodsToPurchase: [],
    }
    cart.products.map(async (item) => {
      if (item.quantity > item.product.stock) {
        purchaseObj.outOfStockProducts.push(item)
      } else {
        item.product.stock = item.product.stock - item.quantity
        purchaseObj.prodsToPurchase.push(item)
        this.deleteProductInCartById(cartId, item.product._id)
        console.log(item)
        let prd = await productsModel.updateOne(
          { _id: item.product._id },
          item.product
        )
      }
    })

    let result = await cartsModel.updateOne({ _id: cartId }, cart)

    return purchaseObj
  }
}
