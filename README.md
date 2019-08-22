# Know Your Gov

Check it out!  

## Summary 

Know Your Gov provides users with their elected representatives information at the state and federal level. The application retrieves their representatives data through their physical address. The user can choose to do a one time search or register their address with the app to load their representatives information. The content is provided by Google's Civic Info Api and gives the user a way to contact their elected representative by phone, website, and email. Know Your Gov is an excellent a way of finding out who represents you and to hold them accountable!

## Features
- Find out your representatives information at the state and federal levels
- Register for an account to save your representatives information for reference

## APIs Used
- Google Civic Info API
- knowyourgov (backend API)

## Stack Used 
- React.js
- CSS
- Node.js
- Express
- PostgreSQL

## Scripts 

- Start the application `npm start`

- Start nodemon for the application `npm run dev`

- Run the tests `npm test`

- Seeding the database `psql -U rod -d knowyourgov -a -f seeds/seed.knowyourgov_tables.sql`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## API Documentation

**Know Your Gov API**

Login Authentication:

- `/authorization/login`

Post user to database:

- `/users`

Get user profile from database:

- `/users/${userId}`

**Google Civic Info API** 

- API Documentation - https://developers.google.com/civic-information/docs/v2/

**Allowed HTTPs Requests**

- `POST`: Add a user to the database or login to the app

- `GET`: Retrieve a user from the database 

**HTTP Responses** 

- `200 OK` - Successful login response or successful get user request

- `201 Created` - The request was successful and the user is created

- `204 No Content` - The request was successful, but no content was returned

- `400 Bad Request` - The request was not understood or missing required parameters

- `401 Unauthorized` - Authentication failed or user did not have correct login permissions

- `404 Not Found` - Resource was not found



