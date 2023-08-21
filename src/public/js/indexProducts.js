const socket = io()
const cart = document.getElementById('cart')
const logout = document.getElementById('logoutButton')

const createCart = async () => {
  const resp = await fetch(`http://localhost:9090/api/sessions/current`, {
    method: 'GET',
  })

  const jsonData = await resp.json()
  window.cart = jsonData.cart

  const a = document.createElement('a')
  a.textContent = 'View Cart'
  a.className = 'view-cart'
  a.href = `http://localhost:9090/cart/${window.cart._id}`
  cart.append(a)
}

window.onload = createCart()

const addToCart = async (prodId) => {
  const quant = document.getElementById(prodId).childNodes[9].value
  console.log(quant)
  const obj = {
    prodId,
    quantity: quant,
  }
  const resp = await fetch(`http://localhost:9090/api/carts/add-to-cart`, {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((result) => {
    if (result.status === 200) {
      console.log(result)
    }
  })
}

logout.addEventListener('click', (e) => {
  e.preventDefault()
  fetch('/api/sessions/logout', {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace('/users/login')
    }
  })
})
