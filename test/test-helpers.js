function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'testuser1',
      password: '$2a$12$PzeNfOF2a94vUPBL7Wg4I.RCZydnhqc8Rehlw1DGkAlbJKu7Gr7wi',
      date_created: '2019-08-24 08:35:58',
      date_modified: null,
      street_address: '2222 SE Avocado St',
      city: 'Pheonix',
      state_code: 'AZ',

    },
    {
      id: 2,
      user_name: 'test-user-2',
      password: '$2a$12$PzeNfOF2a94vUPBL7Wg4I.RCZydnhqc8Rehlw1DGkAlbJKu7Gr7wi',
      date_created: '2019-08-24 08:35:58',
      date_modified: null,
      street_address: '2222 SE Avocado St',
      city: 'Chicago',
      state_code: 'IL',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      password: '$2a$12$PzeNfOF2a94vUPBL7Wg4I.RCZydnhqc8Rehlw1DGkAlbJKu7Gr7wi',
      date_created: '2019-08-24 08:35:58',
      date_modified: null,
      street_address: '2222 SE Avocado St',
      city: 'Seattle',
      state_code: 'WA',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      password: '$2a$12$PzeNfOF2a94vUPBL7Wg4I.RCZydnhqc8Rehlw1DGkAlbJKu7Gr7wi',
      date_created: '2019-08-24 08:35:58',
      date_modified: null,
      street_address: '2222 SE Avocado St',
      city: 'Burlington',
      state_code: 'VT',
    },
  ]
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      knowyourgov_users
      RESTART IDENTITY CASCADE`
  )
}

function seedUsers(db, users) {
  return db
    .into('knowyourgov_users')
    .insert(users)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('knowyourgov_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}


module.exports = {
  makeUsersArray,
  cleanTables,
  seedUsers
}