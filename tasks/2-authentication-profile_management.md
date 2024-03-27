## Authentication and profile management
In this assignment you'll be asked to implement authentication for the different
types of users, `Coders` and `Managers` and some profile management operations.


### Tasks
Here's the list of tasks

#### 1. Account registration
- Add the routes for Coder and Manager registration.
- Add controllers for account registration
- Add the account registration validators to validate the request
- Add the services to create the accounts

#### 2. Account login
In this assignment, you are asked to implement JWT-based authentication
- Add the routes for Coder and Manager login
- Add the controllers for account login
- Add the login data validators
- Add the services to login the coders and send the JWT token that encodes the user `id` and his `role`
which can be either `Manager` or `Coder`

#### 3. Authorization middleware
This middleware will be very important to guard your next endpoints
- Create and express middleware that takes the set of authorized roles as parameter and
based on the token present in the request, it `allows` or `denies` the request.
- The middleware should **inject** user info extracted from the token to the request object.



#### 4. Profile management
- Add endpoints to get the details about the profiles of the `Coder` and the `Manager`.
- Add endpoints to update general information (first name, last name, about) for both `Coders` and `Managers`.

>Note: For the avatar update, you're going to implement later once we present the course related to `firebase`, because
> we are going to use it to store the uploaded images after processing them locally.

