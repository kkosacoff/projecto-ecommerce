import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect

const requester = supertest('http://localhost:9090')

describe('Cart Controller', () => {
  let createdCart // This will hold the created cart

  // before(async () => {
  //   // This runs before each test
  //   const res = await requester.post('/api/carts')
  //   createdCart = res.body.payload // Save the created cart for the test
  // })

  // after(async () => {
  //   // This runs after each test
  //   if (createdCart) {
  //     await requester.delete(`/api/carts/${createdCart._id}`)
  //     createdCart = null // reset for the next test
  //   }
  // })

  it('should create a new cart', async () => {
    const res = await requester.post('/api/carts')

    createdCart = res.body.payload // Save the created cart for the afterEach hook

    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('Success')
    expect(res.body.payload).to.be.an('object')
  })

  it('should get cart by id', async () => {
    const res = await requester.get(`/api/carts/${createdCart._id}`)

    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('Success')
    expect(res.body.payload._id).to.equal(createdCart._id)
  })

  it('should add a product to cart', async () => {
    const pid = '64864556740716ee479bb7d7' // your product id
    const body = { quantity: 2 }

    const res = await requester
      .post(`/api/carts/${createdCart._id}/products/${pid}`)
      .send(body)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')

    console.log(res)

    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('success')
  })

  it('should clear the cart', async () => {
    const res = await requester.delete(`/api/carts/${createdCart._id}`)

    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('Success')
    expect(res.body.msg).to.include(`Cart ${createdCart._id} deleted`)
  })
})
