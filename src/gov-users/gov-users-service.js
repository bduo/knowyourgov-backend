const bcrypt = require('bcryptjs')
const xss = require('xss')
const Treeize = require('treeize')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const GovUsersService = {
    userHasUserName(db, user_name) {
        return db('knowyourgov_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('knowyourgov_users')
            .returning('*')
            .then(([user]) => user)
    },
    getById(db, id) {
        return db
          .from('knowyourgov_users')
          .where('id', id)
          .first()
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'The password must be longer than 8 characters.'
        }
        if (password.length > 72) {
            return 'The password must be shorter than 72 characters.'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with an empty space.'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            'Password must contain one upper case, lower case, number and special character.'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUsers(users) {
        return users.map(this.serializeUser)
      },
    serializeUser(user) {

        const userTree = new Treeize()

        const userData = userTree.grow([ user ]).getData()[0]

        return {
            id: userData.id,
            user_name: xss(userData.user_name),
            date_created: new Date(userData.date_created),
            street_address: userData.street_address,
            city: userData.city,
            state_code: userData.state_code,
        }
    }
}

module.exports = GovUsersService