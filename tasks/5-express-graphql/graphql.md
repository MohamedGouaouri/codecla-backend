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


### GraphQL in the frontend
Now, you are going to change some react endpoints to use GraphQL. There's a nice integration of graphql and rtk-query using [@rtk-query/graphql-request-base-query](https://www.npmjs.com/package/@rtk-query/graphql-request-base-query) package and [graphql-request](https://www.npmjs.com/package/graphql-request) used to make graphql requests.
- Create a new API responsible for making graphql requests. Here's an example of such an API
```js
export const gqlApi = createApi({
  reducerPath: 'api',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://localhost:3000/graphql/', 
      prepareHeaders: (headers, {getState}) => {
          // retrieve token from redux store
          const token = getState().auth?.token;
          if (token) {
              headers.set('uthorization', `Bearer ${token}`)
          }
          return headers
      }
  }),
  endpoints: (builder) => ({})
})
```
As you can see, instead of using the `fetchBaseQuery`, we use `graphqlRequestBaseQuery`. The `prepareHeaders` part used to get the token from redux store and inject it into the header so that it can be used by the server for authentication and authorization.
- Make sure to add the API to redux store as we did previously.
- Create three endpoints:
  - Get all categories endpoints that should return the list of categories in the backend.
  - Get all challenges, where **you should only retrieve the used fields in the table** (status, title, category, difficulty level and solution rate).
  - Make sure to include the category filter in the get all challenges endpoint.
  - Get a challenge by id that will be used to initialize the coding workspace, so make sure to grab all the data (description, code, submission if there is one, the tests etc.)
- Make sure to export the created api hooks.
- Replace the three REST rtk-query hooks (get all categories, get all challenges and get a challenge by id) of your previous with these graphql queries hooks.
- Make sure that the result remains the same. We just did some sort optimization by getting of some over fetching issues.
