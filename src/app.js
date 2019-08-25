require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const authRouter = require('./authorization/auth-router')
const govUsersRouter = require('./gov-users/gov-users-router') 

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
}))
app.use(cors())
app.use(helmet())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/authorization', authRouter)
app.use('/api/users', govUsersRouter)

if (process.env.NODE_ENV === 'production') {
    // Express will serve up production assets
    app.use(express.static('knowyourgov/build'));
  
    // Express serve up index.html file if it doesn't recognize route
    const path = require('path');
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'knowyourgov', 'build', 'index.html'));
    });
  }

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