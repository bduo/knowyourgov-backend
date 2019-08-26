# Know Your Gov API Documentation

## Scripts 

**Start the application** 
- `npm start`

**Start nodemon for the application** 
- `npm run dev`

**Run the tests** 
- `npm test`

**Seeding the database** 
- `psql -U rod -d knowyourgov -a -f seeds/seed.knowyourgov_tables.sql`

## Know Your Gov API Endpoints

**Login Authentication**

- `POST /authorization/login`

**Post user to database**

- `POST /users`

**Get user profile from database**

- `GET /users/:user_id`

## Google Civic Info API

- API Documentation - https://developers.google.com/civic-information/docs/v2/

## Allowed HTTPs Requests

- `POST`: Add a user to the database or login to the app

- `GET`: Retrieve a user from the database 

## HTTP Responses

- `200 OK` - Successful login response or successful get user request

- `201 Created` - The request was successful and the user is created

- `204 No Content` - The request was successful, but no content was returned

- `400 Bad Request` - The request was not understood or missing required parameters

- `401 Unauthorized` - Authentication failed or user did not have correct login permissions

- `404 Not Found` - Resource was not found



