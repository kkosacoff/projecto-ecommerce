export const generateProductErrorInfo = (product) => {
  //return
  return `Una o más propiedades fueron enviadas incompletas o no son válidas.
    Lista de propiedades requeridas:
        * fist_name: type String, recibido: ${product.title}
        * email: type String, recibido: ${product.code}
    `
}
