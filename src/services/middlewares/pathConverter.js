import path from 'path'
const BASE_PATH =
  '/Users/kevinivankosacoff/Documents/Code_Courses/Courses/Coderhouse/Backend/projecto-ecommerce/src/public/'

export const pathConverter = (path) => {
  const relativePath = path.split('/files/').pop()
  const finalPath = '/files/' + relativePath
  return finalPath
}

export const toRelativeURL = (absolutePath) => {
  return path.relative(BASE_PATH, absolutePath)
}
