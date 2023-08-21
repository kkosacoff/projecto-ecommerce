const socket = io()
const productList = document.getElementById('productList')

// const btn = document.getElementsByClassName('delete-button')

const createProductObject = () => {
  const title = document.getElementById('title').value
  const description = document.getElementById('description').value
  const code = document.getElementById('code').value
  const price = parseFloat(document.getElementById('price').value)
  const status = document.getElementById('status').value
  const stock = parseInt(document.getElementById('stock').value)
  const category = document.getElementById('category').value

  const product = {
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
  }
  return product
}

function uploadFiles() {
  // Append files to formData
  const productFile = document.getElementById('product').files[0]

  if (productFile) formData.append('product', productFile)

  fetch('/api/users/:uid/documents', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      // Handle the response, maybe update the UI to indicate successful upload.
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

const handleSubmitCreate = async () => {
  const formData = new FormData()
  const formProduct = createProductObject()
  if (
    !(formProduct.title,
    formProduct.description,
    formProduct.code,
    formProduct.price,
    formProduct.status,
    formProduct.stock,
    formProduct.category)
  ) {
  } else {
    const productFile = document.getElementById('product').files[0]
    formData.append('product', productFile)
    formData.append('formProduct', JSON.stringify(formProduct))
    console.log(formData)

    const resp = await fetch(`http://localhost:9090/api/products`, {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'application/json',
      // },
    })
      .then((result) => {
        if (result.status === 201) {
          // console.log(result.json())
        }
        return result.json()
      })
      .then((data) => {
        console.log(data)
        socket.emit('addProduct', data.payload)
      })
  }
}

const handleDelete = async (prodId) => {
  const resp = await fetch(`http://localhost:9090/api/products/${prodId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    if (result.status === 201) {
      console.log(result)
      socket.emit('deleteProduct', prodId)
    }
  })
}

socket.on('updateProductList', (product) => {
  console.log(product)
  const li = document.createElement('li')
  const btn = document.createElement('button')
  btn.textContent = 'Delete'
  btn.className = 'delete-button'
  // btn.onclick = handleDelete(product.prodId)
  li.id = product._id
  li.textContent = `${product.title} - $${product.price}`
  li.appendChild(btn)
  productList.appendChild(li)
})

socket.on('removeProductFromList', (prodId) => {
  console.log(prodId)
  const li = document.getElementById(prodId)
  if (li) {
    productList.removeChild(li)
  }
})
