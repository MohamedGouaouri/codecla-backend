## Graphql assignment
In this assignment, you're going to change some data fetching endpoints in your express application and replace them with their equivalent in GraphQL.
At the end you are asked to update these endpoints in your React application as well with a graphql client.

### Initial setup
- We recommend you create a new branch so that your previous implementation is safely kept for both of your frontend and backend apps.
- In your express application, make sure to install the necessary libraries, [graphql](https://www.npmjs.com/package/graphql) and [express-graphql](https://www.npmjs.com/package/express-graphql).

### GraphQL in the backend

#### Queries and types schema definitions
- Create a graphql schema.
- Translate your mongoose models (`Coder`, `Manager` and `Challenge`) into graphql types.

For example, the manager model will be translated into the following type:
```
    type Manager {
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        password: String!
    }
```

- Create queries to get all the challenges (They should accept the `category` filter to get challenges of that category only), get a challenge by id and get all the categories.
- Create resolver functions for each query. For the resolvers, you can make use of your previously developed services.
>Note: For our previous implementation, we extracted the authentication token from the header, parsed it and passed the id and role of the user to the services
> in order to get tailored responses (Include the status and solution rate of the challenge for a specific coder for example).
> For this implementation, at first, you can force a token to be passed as an argument to the query, parse it in the resolver and use it. Once you start integrating GraphQL within React, you are going to provide
> the token as a request header and retrieve in the resolver without forcing the token to be present in the query.


