import ProductManager from './ProductManager.js'

const pm1 = new ProductManager('/products.json')

pm1.deleteProductById(0)
