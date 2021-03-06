'use strict';

const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Gov User Endpoint', () => {
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

  describe('POST /api/users', () => {
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
      it('Responds with 400 error when password is less than 8 characters', () => {
        const testUser = {
          'user_name': 'testuser',
          'password': '12345',
          'street_address': '2222 SE Avocado St',
          'city': 'Portland',
          'state_code': 'OR'

        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'The password must be longer than 8 characters.'})
      })

      it('Responds with 400 error when password is too long', () => {
        const testUser = {
          'user_name': "testuser",
          'password': '*'.repeat(92),
          'street_address': '2222 SE Avocado St',
          'city': 'Portland',
          'state_code': 'OR'
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'The password must be shorter than 72 characters.'})
      })

      it('Responds with 400 error when password starts or ends with a space', () => {
        const testUser = {
          'user_name': 'testuser',
          'password': ' P@ssw0rd',
          'street_address': '2222 SE Avocado St',
          'city': 'Portland',
          'state_code': 'OR'
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'Password must not start or end with an empty space.'})
      })

      it('responds with 400 error when password is not complex enough', () => {
        const testUser = {
          'user_name': 'testuser',
          'password': 'password',
          'street_address': '2222 SE Avocado St',
          'city': 'Portland',
          'state_code': 'OR'
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(400, {error: 'Password must have an upper case, a lower case, a number, and a special character'})
      })
    })

    context('Registration is valid', () => {
      it('responds with 201 and username', () => {
       
        const testUser = {
          'id': 5,
          'user_name': 'testuser',
          'password': 'P@ssw0rd',
          'street_address': '2222 SE Avocado St',
          'city': 'Portland',
          'state_code': 'OR',
        }

        return supertest(app)
          .post('/api/users')
          .send(testUser)
          .expect(201) 
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.user_name).to.eql(testUser.user_name)
            expect(res.body).to.not.have.property('password')
            expect(res.body.street_address).to.eql(testUser.street_address)
            expect(res.body.city).to.eql(testUser.city)
            expect(res.body.state_code).to.eql(testUser.state_code)
            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
      })
    })

  })
})