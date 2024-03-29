
## Leaderboard
In this assignment, you are going to implement the leaderboard ranking functionality.

### Tasks
Here's the list of tasks

#### 1. Leaderboard
- Add a route to get the leaderboard
- Protect that route so that only the coder is allowed to see leaderboard
- Add the controller for that route
- Add the service to get the leaderboard
- The leaderboard should list all the coders sorted by their score (from the highest to the lowest).
- You should add the number of `solved_challenges` for each coder in the response.

#### 2. Top K coders
- Protect that route so that only the coder is allowed to see leaderboard
- Add a route get the top k coders (k is a number passed a query parameter).
- Add the controller for that route
- Add the service for that controller to get the top k coders.
- The code of that service should be similar to the previous leaderboard task, you just need to `limit` the number of returned to `k`.

