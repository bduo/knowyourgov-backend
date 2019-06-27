const express = require('express')
const path = require('path')
const GovUsersService = require('./gov-users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { user_name, password } = req.body

        for (const field of ['user_name', 'password']) {
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            }
        }

        const passwordError = GovUsersService.validatePassword(password)

        if (passwordError) {
            return res.status(400).json({ error: passwordError })
        }

        GovUsersService.userHasUserName(
            req.app.get('db'),
            user_name
        )
            .then(userHasUserName => {
                if (userHasUserName) {
                    return res.status(400).json({ error: `Username has been taken`})
                }

                return GovUsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            user_name,
                            password: hashedPassword,
                            date_created: 'now()'
                        }

                        return GovUsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(GovUsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

    module.exports = usersRouter