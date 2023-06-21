import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Generate hash
export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Compare DB stored password with hash
export const isValidPassword = (user, password) => {
  // console.log(
  //   `Datos a validar: user-password: ${user.password}, password: ${password}`
  // )
  return bcrypt.compareSync(password, user.password)
}

export const generateProduct = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(),
    price: faker.commerce.price(),
    stock: faker.number.int(100),
    category: faker.helpers.arrayElement([
      'Out of Stock',
      'Inactive',
      'Active',
    ]),
    image: faker.image.url(),
  }
}

export default __dirname
