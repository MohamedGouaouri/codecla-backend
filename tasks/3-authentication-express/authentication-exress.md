## Introduction

In this assignment, you'll validate your knowledge and implement authentication-related functionalities, such as account registration and login, email verification and authorization middleware.


### I. Account registration
- Create a service to register account for each user type (`Coder` and `Manager`).
- Make sure to return proper responses when the user supplies an already existing email as we don't allow duplicate emails in the database.
- The account should be registered as `unverified`.
- You should send a verification email to user containing a token to verify it.
  - For email verification, you should generate a [JWT](https://jwt.io/) token that encodes the id and the role of the user.
  - Next, create token-`paramterized` path (a route that accepts a token as url param) with that token.
  - Use [nodemailer](https://www.nodemailer.com/) to send an email containing that token.
  - Create a verification route that meets the verification path, you should verify the token, search for the user by the id encoded in the token and if everything is good, update the `is_verified` field to true.
  - Make sure to return proper responses in case of success and errors (You can return html templates that contains the messages).

### II. Account login
- Create a service to login each user type (`Coder` and `Manager`).
- Make sure to return proper responses when the user has not yet verified his email or gives wrong credentials.
- If the user is verified and has supplied correct credentials, you should create [JWT](https://jwt.io/) token that encodes two important information, the user id and his role (`Coder` or `Manager`).

### III. Authorization middleware
Next, you have to implement authentication and authorization middleware.
This middleware will be very important to guard the endpoints.
- Create an express middleware creator that takes the set of authorized roles as parameter and
  based on the token present in the request, it `allows` or `denies` the request.
- The middleware should **inject** user info (id and role) extracted from the token to the request object.

