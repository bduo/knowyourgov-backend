'use strict';

const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Gov User Endpoints', () => {
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
  })
})