module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL || 'postgresql://rod@localhost/knowyourgov',
    JWT_SECRET: process.env.JWT_SECRET || 'rodthebod'
}