import { fileURLToPath } from 'url'
import path from 'path'
import bcrypt from 'bcrypt'
import { faker } from '@faker-js/faker'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

// Generate a random alphanumeric code
export const generateCode = (length) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return code
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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = path.join(__dirname, '/public/files')
    switch (file.fieldname) {
      case 'profile':
        folder = path.join(folder, 'profiles/')
        break
      case 'national_id':
        folder = path.join(folder, 'documents/')
        break
      case 'proof_of_address':
        folder = path.join(folder, 'documents/')
        break
      case 'bank_statement':
        folder = path.join(folder, 'documents/')
        break
      case 'product':
        folder = path.join(folder, 'products/')
        break
      default:
        break
    }
    cb(null, folder)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

export const upload = multer({ storage: storage })

export default __dirname
