const socket = io()
const productList = document.getElementById('productList')

const btn = document.getElementsByClassName('delete-button')
// btn.addEventListener('click', (e) => {
//   console.log(e.target.parentNode.id)
// })

const createProductObject = () => {
  const title = document.getElementById('title').value
  const description = document.getElementById('description').value
  const code = document.getElementById('code').value
  const price = parseFloat(document.getElementById('price').value)
  const status = document.getElementById('status').value
  const stock = parseInt(document.getElementById('stock').value)
  const category = document.getElementById('category').value
  const thumbnails = document.getElementById('thumbnails').value

  const product = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: [],
  }

  return product
}

const handleSubmitCreate = () => {
  const formProduct = createProductObject()
  if (
    !(formProduct.title,
    formProduct.description,
    formProduct.code,
    formProduct.price,
    formProduct.status,
    formProduct.stock,
    formProduct.category,
    formProduct.thumbnails)
  ) {
  } else {
    socket.emit('addProduct', formProduct)
  }
}

socket.on('updateProductList', (product) => {
  const li = document.createElement('li')
  const btn = document.createElement('button')
  btn.textContent = 'Delete'
  btn.className = 'delete-button'
  // btn.onclick = handleDelete(product.prodId)
  li.id = product.prodId
  li.textContent = `${product.title} - $${product.price}`
  li.appendChild(btn)
  productList.appendChild(li)
  // console.log(`Product ${product.title} added`)
})

const handleDelete = (prodId) => {
  console.log(prodId)
  socket.emit('deleteProduct', prodId)
}

socket.on('removeProductFromList', (prodId) => {
  const li = document.getElementById(prodId)
  if (li) {
    productList.removeChild(li)
  }
})
