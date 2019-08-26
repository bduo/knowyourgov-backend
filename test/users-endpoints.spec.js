'use strict';

const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('User Endpoints', () => {
  let db

  const testUsers = helpers.makeUsersArray()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/users`, () => {
    beforeEach('insert users', () => {
      helpers.seedUsers(db, testUsers)
    })

    const requiredFields = ['user_name', 'password', 'street_address', 'city', 'state_code']

    requiredFields.forEach(field => {
      const registerAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
        street_address: testUser.street_address,
        city: testUser.city,
        state_code: testUser.state_code,
      }

    it(`Responds with 400 required error when ${field} is missing`, () => {
      delete registerAttemptBody[field]

      return supertest(app)
        .post('/api/users')
        .send(registerAttemptBody)
        .expect(400, {
          error: `Missing '${field}' in request body`
          
        })
    })
  })

    context(`Password errors`, () => {
      it(`Responds with 400 error when password is less than 8 characters`, () => {
        const testUser = {
          "user_name": "testuser",
          "password": "12345"
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'The password must be longer than 8 characters.'})
      })

      it(`responds with 400 error when password is too long`, () => {
        const testUser = {
          "user_name": "testuser",
          "password": '*'.repeat(92)
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'password must be less than 72 characters'})
      })

      it(`reponds with 400 error when password starts or ends with space`, () => {
        const testUser = {
          "user_name": "testuser",
          "password": ' P@ssw0rd'
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'password cannot start or end with empty spaces'})
      })

      it(`responds with 400 error when password is not complex enough`, () => {
        const testUser = {
          "user_name": "testuser",
          "password": 'password'
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'password must have an upper case, a lower case, a number, and a special character'})
      })
    })

    context(`Registration is valid`, () => {
      it(`responds with 200 and username`, () => {
        const testUser = {
          "id": "5",
          "user_name": 'testuser',
          "password": 'P@ssw0rd',
          "date_created": '2019-08-26T10:21:30.191Z',
          "street_address": '2222 SE Avocado St',
          "city": 'Portland',
          "state_code": 'OR',
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(201, {
            "id": testUser.id, 
            "user_name": testUser.user_name,
            "password": testUser.password,
            "date_created": testUser.date_created,
            "street_address": testUser.street_address,
            "city": testUser.city,
            "state_code": testUser.state_code,
          })
      })
    })

    

    context(`User is already in db`, () => {
      it(`responds with 400 and error`, () => {
        const testUser = {
          "user_name": 'testuser1',
          "password": 'P@ssw0rd'
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'username already exists'})
      })
    })    
 
})
})