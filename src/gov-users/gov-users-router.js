const express = require('express')
const path = require('path')
const GovUsersService = require('./gov-users-service')
const { requireAuth } = require('../middleware/jwt-auth')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { user_name, password, street_address, city, state_code } = req.body

        for (const field of ['user_name', 'password', 'street_address', 'city', 'state_code']) {
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
                            date_created: 'now()',
                            street_address,
                            city,
                            state_code
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

    usersRouter
    .route('/:user_id')
    .all(requireAuth, checkUserExists)
    .get((req, res) => {
        return res.json(GovUsersService.serializeUser(res.user))
    })
    
    /* async/await syntax for promises */
    async function checkUserExists(req, res, next) {
        try {
            const user = await GovUsersService.getById(
            req.app.get('db'),
            req.params.user_id
        )
    
        if (!user)
            return res.status(404).json({
            error: `User doesn't exist`
            })
    
        res.user = user
        next()
        } catch (error) {
        next(error)
        }
  }

    module.exports = usersRouter