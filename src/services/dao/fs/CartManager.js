import fs from 'fs'

export default class CartManager {
  static globalId = 0 // product code number global tracker

  constructor(filename) {
    this.carts = [] // initialize empty array
    this.path = './files'
    this.filename = this.path + filename
  }

  // Class Methods

  createCart = async () => {
    // Creating dir if not created yet
    await fs.promises.mkdir(this.path, { recursive: true })

    const cartId = CartManager.globalId++
    const newCart = {
      cartId,
      products: [],
    }
    this.carts.push(newCart)

    try {
      await fs.promises.writeFile(this.filename, JSON.stringify(this.carts))
      console.log('Cart added to file')
      return newCart
    } catch {
      throw new Error()
    }
  }

  getCartById = async (id) => {
    let result = await fs.promises.readFile(this.filename)
    let parsedRes = await JSON.parse(result)

    const filteredArr = parsedRes.find(
      // compare id param vs id from products array
      (cart) => cart.cartId == id
    )
    return filteredArr ? filteredArr : ''
  }

  addProductToCartById = async (cartId, prodId, quantity) => {
    let cartArr = await fs.promises.readFile(this.filename)
    let parsedArr = JSON.parse(cartArr)

    if (await this.getCartById(cartId)) {
      const newCartArr = parsedArr.map((cart) => {
        if (cart.cartId == cartId) {
          const productAlreadyInCart = cart.products.some(
            (item) => item.productId === prodId
          )

          if (!productAlreadyInCart) {
            cart.products.push({ productId: prodId, quantity })
          } else {
            {
              cart.products = cart.products.map((product) => {
                if (product.productId == prodId) {
                  return { ...product, quantity: product.quantity + quantity }
                } else {
                  return product
                }
              })
            }
          }
        }
        return cart
      })

      await fs.promises.writeFile(this.filename, JSON.stringify(newCartArr))
      return cartId, prodId
    } else {
      console.log('Cart not found')
    }
  }
}
