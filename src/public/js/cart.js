const purchaseButton = document.getElementById('purchase')

const getSession = async () => {
  const resp = await fetch(`/api/sessions/current`, {
    method: 'GET',
  })

  const jsonData = await resp.json()
  console.log(jsonData)
  window.cart = jsonData.cart
}

window.onload = getSession()

const purchaseCart = async () => {
  const resp = await fetch(`/api/carts/${window.cart._id}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (resp.status === 200) {
    const jsonData = await resp.json()
    const ticketId = jsonData.payload._id.toString()
    window.location.replace(`/ticket/${ticketId}`)
  }
}
