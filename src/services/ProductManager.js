import fs from 'fs'

export default class ProductManager {
  static globalId = 0 // product code number global tracker

  constructor(filename) {
    this.products = [] // initialize empty array
    this.path = './files'
    this.filename = this.path + filename
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
    // Creating dir if not created yet
    await fs.promises.mkdir(this.path, { recursive: true })

    // Write the file
    if (
      !(title, description, code, price, status, stock, category, thumbnails)
    ) {
      // check that all params exist
      console.log('Missing parameter')
      return false
    } else if (this.products.find((prod) => prod.code == code)) {
      console.log('Product with that ID already exists')
      return false
    } else {
      const prodId = ProductManager.globalId++ // Add 1 to the code static variable
      const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
        prodId,
      }
      this.products.push(newProduct)
      await fs.promises.writeFile(this.filename, JSON.stringify(this.products))
      console.log(`Product ${newProduct.prodId} added succesfully`)
      return newProduct
    }
  }

  getProducts = async () => {
    // Read the file and convert to JS Object
    let result = await fs.promises.readFile(this.filename)
    let parsedRes = await JSON.parse(result)
    console.log('Reading file')
    return parsedRes
  }

  getProductById = async (id) => {
    let result = await fs.promises.readFile(this.filename)
    let parsedRes = await JSON.parse(result)

    const filteredArr = parsedRes.find(
      // compare id param vs id from products array
      (product) => product.prodId == id
    )
    return filteredArr ? filteredArr : ''
  }

  updateProductById = async (id, updatedData) => {
    let result = await fs.promises.readFile(this.filename)
    let parsedRes = await JSON.parse(result)

    if (await this.getProductById(id)) {
      const newArr = parsedRes.map((item) => {
        return id == item.prodId ? { ...item, ...updatedData } : item
      })
      await fs.promises.writeFile(this.filename, JSON.stringify(newArr))
      return id, updatedData
    } else {
      console.log(`Product ID ${id} does not exist`)
    }
  }

  deleteProductById = async (id) => {
    let result = await fs.promises.readFile(this.filename)
    let parsedRes = await JSON.parse(result)

    if (await this.getProductById(id)) {
      const newArr = parsedRes.filter((item) => item.prodId !== id)
      await fs.promises.writeFile(this.filename, JSON.stringify(newArr))
      console.log(`Prod ${id} deleted`)
      return id
    } else {
      console.log(`Product ID ${id} does not exist`)
      return false
    }
  }
}
