'use strict';

const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', () => {
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

  describe(`POST /api/authorization/login`, () => {
    beforeEach('insert users', () => {
      helpers.seedUsers(db, testUsers)
    })

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(key => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password
      }

    it(`Responds with 400 required error when ${key} is missing`, () => {
      delete loginAttemptBody[key]

      return supertest(app)
        .post('/api/authorization/login')
        .send(loginAttemptBody)
        .expect(400, {
          error: `Request body is missing a '${key}'`
          
        })
    })

    it(`Responds with 400 'invalid user_name or password' with a bad username`, () => {
      const userInvalidUser = { 
        user_name: 'user-not', 
        password: 'existy' 
      }

      return supertest(app)
        .post('/api/authorization/login')
        .send(userInvalidUser)
        .expect(400, {
          error: `Incorrect username or password`
        })
    })

    it(`Responds with 400 'invalid user_name or password' when a bad password is provided`, () => {
      const userInvalidPass = { 
        user_name: testUser.user_name, 
        password: 'incorrect' 
      }

      return supertest(app)
        .post('/api/authorization/login')
        .send(userInvalidPass)
        .expect(400, {
          error: `Incorrect username or password`
        })
    })

    it(`Responds with 200 and JWT authorization token using a secret when valid credentials`, () => {
        const testUser = {
          user_name: 'testuser1',
          password: 'P@ssw0rd',
        }

        return supertest(app)
          .post('/api/authorization/login')
          .send(testUser)
          .expect(200)
      })
  })

  })

})