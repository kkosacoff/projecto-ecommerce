import productsModel from './models/products.js'

export default class ProductManager {
  static globalId = 0 // product code number global tracker

  constructor() {
    this.products = [] // initialize empty array
  }

  // Class Methods

  addProduct = async ({
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  }) => {
    const newProduct = await productsModel.create({
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    })
    return newProduct
  }

  getProducts = async () => {
    let products = await productsModel.find()
    return products.map((product) => product.toObject())
  }

  getProductsNew = async (limit, page, filter, sort) => {
    const filterObj = filter ? JSON.parse(filter) : {}

    const optionsObj = {
      limit: limit ? limit : 10,
      page: page ? page : 1,
      sort: sort ? { price: sort } : {},
    }

    let products = await productsModel.paginate(filterObj, optionsObj)
    products.docs = products.docs.map((product) => product.toObject())
    return products
  }

  getProductById = async (id) => {
    const product = productsModel.findById(id)
    return product ? product : false
  }

  updateProductById = async (id, updatedData) => {
    const result = await productsModel.findOneAndUpdate(
      { _id: id },
      updatedData
    )

    if (result) {
      return result
    } else {
      console.log(`Product ID ${id} could not be updated`)
      return false
    }
  }

  deleteProductById = async (id) => {
    const deletedProd = await productsModel.deleteOne({ _id: id })

    if (deletedProd) {
      console.log(`Prod ${id} deleted`)
      return true
    } else {
      console.log(`Product ID ${id} couldn't be deleted`)
      return false
    }
  }
}
