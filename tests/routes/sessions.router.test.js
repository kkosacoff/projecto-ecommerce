import chai from 'chai'
import supertest from 'supertest'
import userModel from '../../src/services/dao/db/models/users.js'

const expect = chai.expect

const requester = supertest('http://localhost:9090/api/sessions')

describe('Authentication routes', () => {
  it('should register a new user', async () => {
    const newUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com',
      age: 25,
      role: 'User',
      password: 'testpassword',
    }

    const res = await requester.post('/register').send(newUser)

    expect(res.status).to.equal(200)
    expect(res.body.status).to.equal('success')
    expect(res.body.message).to.equal('user registered')
  })

  it('should fail to register a duplicate user', async () => {
    const newUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'testuser@example.com', // same as above
      age: 25,
      role: 'user',
      password: 'testpassword',
    }

    const res = await requester.post('/register').send(newUser)

    expect(res.status).to.equal(302) // Expect redirect on failure
  })

  it('should login a user', async () => {
    const loginUser = {
      email: 'testuser@example.com',
      password: 'testpassword',
    }

    const res = await requester.post('/login').send(loginUser)

    expect(res.status).to.equal(200)
    expect(res._body.status).to.equal('success')
    expect(res._body.message).to.equal('user logged in')
  })

  it('should not login a user with invalid credentials', async () => {
    const loginUser = {
      email: 'testuser@example.com',
      password: 'wrongpassword',
    }

    const res = await requester.post('/login').send(loginUser)

    expect(res.status).to.equal(302) // Expect redirect on failure
  })
})
