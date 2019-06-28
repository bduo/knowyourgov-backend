const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

  
  

  function makeThingsFixtures() {
    const testUsers = makeUsersArray()
    const testThings = makeThingsArray(testUsers)
    return { testUsers, testThings }
  }
  
  function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
         thingful_users
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE knowyourgov_users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('knowyourgov_users_id_seq', 0)`),
        ])
      )
    )
  }
  
  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('knowyourgov_users').insert(preppedUsers)
      .then(() =>
         // update the auto sequence to stay in sync
         db.raw(
          `SELECT setval('thingful_users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }
  
  function seedThingsTables(db, users, things, reviews=[]) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('thingful_things').insert(things)
      // update the auto sequence to match the forced id values
      await trx.raw(
        `SELECT setval('thingful_things_id_seq', ?)`,
        [things[things.length - 1].id],
      )
      // only insert comments if there are some, also update the sequence counter
      if (reviews.length) {
        await trx.into('thingful_reviews').insert(reviews)
        await trx.raw(
          `SELECT setval('thingful_reviews_id_seq', ?)`,
          [reviews[reviews.length - 1].id],
        )
      }
    })
  }
  
  function seedMaliciousThing(db, user, thing) {
    return seedUsers(db, [user])
      .then(() =>
        db
          .into('thingful_things')
          .insert([thing])
      )
  }
  
  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`
  }
  
  
  module.exports = {
    makeUsersArray,
    makeThingsArray,
    makeExpectedThing,
    makeExpectedThingReviews,
    makeMaliciousThing,
    makeReviewsArray,
  
    makeThingsFixtures,
    cleanTables,
    seedMaliciousThing,
    makeAuthHeader,
    seedUsers,
    seedThingsTables,
  }
  