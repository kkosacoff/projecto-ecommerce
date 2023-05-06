const socket = io()
const cart = document.getElementById('cart')
const logout = document.getElementById('logoutButton')

const createCart = async () => {
  const resp = await fetch(`http://localhost:9090/api/carts`, {
    method: 'POST',
  })

  const jsonData = await resp.json()

  window.cart = jsonData.payload

  const a = document.createElement('a')
  a.textContent = 'View Cart'
  a.className = 'delete-button'
  a.href = `http://localhost:9090/cart/${window.cart._id}`
  cart.append(a)
}

window.onload = createCart()

const handleAddToCart = (prodId) => {
  const quant = document.getElementById(prodId).childNodes[7].value
  socket.emit('addToCart', window.cart, prodId, quant)
}

socket.on('clientCart', (newCart) => {
  // window.cart = newCart
  const a = document.createElement('a')
  a.textContent = 'View Cart'
  a.className = 'delete-button'
  a.href = `http://localhost:9090/cart/${newCart._id}`
  cart.append(a)
})

logout.addEventListener('click', (e) => {
  console.log('click')
  e.preventDefault()
  fetch('/api/sessions/logout', {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace('/users/login')
    }
  })
})
