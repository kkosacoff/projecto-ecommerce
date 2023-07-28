import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect

const requester = supertest('http://localhost:9090')

describe('Product Controller', () => {
  let createdProduct // This will hold the created product

  afterEach(async () => {
    // This runs after each test
    if (createdProduct) {
      await requester.delete(`/api/products/${createdProduct._id}`)
      createdProduct = null // reset for the next test
    }
  })

  it('should add a new product', async () => {
    const product = {
      title: 'Bateria',
      description: 'Es una bateria',
      code: '11111111121211',
      price: 100,
      status: 'Active',
      stock: 10,
      category: 'Bass',
      thumbnails: ['ruta1'],
    }

    const res = await requester.post('/api/products').send(product)
    createdProduct = res.body.payload

    expect(res.status).to.equal(201)
    expect(res.body.status).to.equal('success')
    expect(res.body.payload.code).to.equal(product.code)
  })

  it('should get all products', async () => {
    const res = await requester.get('/api/products')

    expect(res.status).to.equal(200)
    expect(res.body.msg).to.equal('success')
    expect(res.body.payload).to.be.an('array')
  })

  it('should get product by id', async () => {
    const id = '644045025673a6124daab787' // Your product id
    const res = await requester.get(`/api/products/${id}`)

    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('success')
    expect(res.body.payload._id).to.equal(id)
  })
})
