## Statistics
In this assignment, you are going to implement various system statistics (or analytics) such as the heatmap
to describe how many recent correct submissions are made by that coder.
Also how many challenges the coder has solved for various difficulty levels and the trending categories.

> Note: In this assignment, some operations require the use the powerful mongodb aggregation pipeline either for performance or elegance. For which we are going to provide details about the pipeline's stages.
### Tasks
Here's the list the tasks

#### 1. Solved Challenges Statistics
for this endpoint we want something that looks like this as output
```json
{
  "totalEasySolvedChallenges":  10,
  "totalModerateSolvedChallenges":  2,
  "totalHardSolvedChallenges": 1,
  "totalEasyChallenges":  111,
  "totalModerateChallenges":  40,
  "totalHardChallenges": 5
}
```
Where

|    Field     |                                 Description                                  |
|:------------:|:----------------------------------------------------------------------------:|
| `totalEasySolvedChallenges` |                 The total number of `Easy` solved challenges                 |
| `totalModerateSolvedChallenges` |               The total number of `Moderate` solved challenges               |
| `totalHardSolvedChallenges` |                 The total number of `Hard` solved challenges                 |
|`totalEasyChallenges` |   The total number of `Easy` challenges that are available in the platform   |
|`totalModerateChallenges` | The total number of `Moderate` challenges that are available in the platform |
|`totalHardChallenges` | The total number of `Hard` challenges that are available in the platform |

- Add a route to get the solved challenges statistics.
- Add the controller for that route
- Add the service for that controller.

To get the analytics data as described in the previous data example, you need first to get the total number of challenges for each level
and then, for each difficulty level, get the number of correct submissions.

#### 2. Trending categories statistics
For this we want a response data similar to the following:
```json
[
  {
    "category":"Data structure",
    "count":300
  },
  {
    "category":"Graphs",
    "count":100
  },
  {
    "category":"Tree",
    "count":5
  },
  {
    "category":"Math",
    "count":1
  }
]

```

- Add a route to get the trending categories.
- Add the controller for that route
- Add the service for that controller.

You can use here the aggregation pipeline of mongodb by composing the following stages:
-  Filter submissions to include only those where the isPassed field is true. 
to ensures that only passed submissions are considered for further processing in the pipeline.
- Perform a lookup (similar to `SQL join` operation) from submissions to challenges
- Next you can group the result by the `category` and cumulate the number of occurrences denoted by `count`.
- Next you can add the `category` field to the result which is the one expected in the output
- Next, you have to sort the result based on the that `count` in descending order.
- Finally, you have to `project` the result and keep the `category` and `count` fields only.

#### 3. Heatmap
For the submission strikes heatmap, we want a result like this
```json
[
  {
    "date": "2024/04/01",
    "count": 10
  },
  {
    "date": "2024/04/01",
    "count": 10
  }
]
```
The user can specify the `start_date` and `end_date` as query argument in the request to get strikes within that date range.

- Add the route to get the heatmap
- Add the controller for that route, you should extract date filters and pass it to the service
- Add the service for that controller

To implement the service, make sure you date which are strings to be `Date` objects (you can use `new Date(date as string)`).

If the dates are not specified, the `start_date` should be set to the current date **minus** a year, and the `end_date` should be
set to the current date.

Similar to the categories trends you can use the aggregation pipelines with the following stages:
- First, you need to filter the passed submissions based on the coder and the submission date which should be between the start and end dates.
- Next, you add a date field to result out of the `submittedAt` field and make it follow this format: `YYYY/mm/dd`.
- Next, you have to group the resulting documents by the `date` field and calculate the `count` of submissions for each unique `date`.
- Finally, you have to `project` the result and keep the `date` and `count` fields only.

