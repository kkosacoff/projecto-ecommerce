import config from '../config/config.js'
import MongoSingleton from '../config/mongo-singleton.js'

// Para cambiar de persistencia
// node src/app.js --persist files --mode dev

let productService

switch (config.persistence) {
  case 'mongodb':
    const mongoInstance = async () => {
      // console.log('Entrando a iniciar Service para MongoDb')
      try {
        await MongoSingleton.getInstance()
      } catch (error) {
        console.error(error)
        process.exit(0)
      }
    }
    mongoInstance()
    const { default: ProductServiceMongo } = await import(
      './dao/db/product.services.js'
    )
    productService = new ProductServiceMongo()
    // console.log('Product service loaded:')
    // console.log(productService)
    break
  case 'fs':
    const { default: ProductServiceFileSystem } = await import(
      './dao/fs/ProductManager.js'
    )
    productService = new ProductServiceFileSystem()
    // console.log('Product service loaded:')
    // console.log(productService)
    break

  default:
    break
}

export { productService }
