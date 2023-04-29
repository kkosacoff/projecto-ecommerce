const socket = io()
const cart = document.getElementById('cart')
const logout = document.getElementById('logoutButton')

const createCart = () => {
  socket.emit('createCart')
}

window.onload = createCart()

const handleAddToCart = (prodId) => {
  const quant = document.getElementById(prodId).childNodes[7].value
  socket.emit('addToCart', window.cart, prodId, quant)
}

socket.on('clientCart', (newCart) => {
  window.cart = newCart
  const a = document.createElement('a')
  a.textContent = 'View Cart'
  a.className = 'delete-button'
  a.href = `http://localhost:9090/home/cart/${newCart._id}`
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
