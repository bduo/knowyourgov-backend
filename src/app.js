require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
// const axios = require('axios')
const authRouter = require('./authorization/auth-router')
const govUsersRouter = require('./gov-users/gov-users-router') 

const app = express()

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

app.use('/api/authorization', authRouter)
app.use('/api/users', govUsersRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// app.get('/test', (req, res) => {
//     axios.get('https://www.googleapis.com/civicinfo/v2/representatives?address=1414 SE 23rd Ave Portland, OR&includeOffices=true&roles=legislatorLowerBody&key=AIzaSyAdhosVMLAvrsS4Gs2wjWLrAvWSHCOsG_A')
//     .then(result => res.send(result))
// })

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})
    


module.exports = app