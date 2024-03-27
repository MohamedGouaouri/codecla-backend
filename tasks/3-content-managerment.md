
## Content management
In this assignment, you are going to implement the functionalities of the `Manager`, more precisely, the operations
on the `Challenges`.

### Tasks
Here's the list of tasks

#### 1. Challenge creation
- Add a route to create a challenge.
- The endpoint should be protected and the `Manager` is the **sole** entity or role responsible
for the creation (Any request made by any other type should be denied).
- Add the controller and create the validator for challenge creation
- Add the service to create the challenge and persist it in the database

Here's an example of a challenge creation request:
```json
{
    "title": "factorial",
    "category": "Math",
    "description": "### Problem Statement:\nCompute the factorial of a non-negative integer `n`, denoted as `n!`. The factorial of `n` is the product of all positive integers less than or equal to `n`.\n\n### Example:\nFor example, the factorial of `5` is `5! = 5 * 4 * 3 * 2 * 1 = 120`.\n\n### Constraints:\n- The input `n` is a non-negative integer.\n- `0 <= n <= 20`.\n\n### Approach:\nA simple approach to compute the factorial of `n` is to use recursion. We define a recursive function `factorial(n)` that returns the factorial of `n`. The base case of the recursion is when `n` is `0` or `1`, in which case the factorial is `1`. Otherwise, we recursively compute the factorial of `n-1` and multiply it by `n`.\n\n### Implementation:\nTo implement this, we can define a recursive function `factorial(n)` that takes a non-negative integer `n` as input and returns its factorial. In the function, we handle the base case when `n` is `0` or `1`, and recursively call `factorial(n-1)` for other values of `n`. Finally, we return the product of `n` and the factorial of `n-1`.",
    "level": "Hard",
    "code": {
        "function_name": "factorial",
        "code_text": [
            {
                "language": "py",
                "text": "def factorial(n):\n    return 1"
            },
            {
                "language": "js",
                "text": "function factorial(n) {\n return 1\n}"
            }
        ],
        "inputs": [
            {
                "name": "n",
                "type": "number"
            }
        ]
    },
    "tests": [
        {
            "weight": 0.8,
            "inputs": [
                {
                    "name": "n",
                    "value": 5
                }
            ],
            "output": 120
        }
    ]
}
```

As you can see, the challenge has a title, description (which is in a markdown format), category and level.
And most importantly the code object which has the code text as an array of the actual code and the language and the list of test cases along with inputs
and the expected outputs.


#### 3. Challenge listing

- Add a route to get all the challenges
- Add the controller for that route
- Add the service to list all the challenges.

> If the coder is the entity who made the request, then we should show all the challenges available.
However, if the manager is the entity that made the request, then we should show his created challenges only.

> An important thing to consider is that other relevant information should be included for each
challenge, like its `solution rate` which the percentage of the coders that correctly solved the challenge.

> And more specifically, if code is the entity that made the request, then you should show the status of the challenge. The values for challenge status
are:

| Status 1     | Description                                                                                          |
|--------------|------------------------------------------------------------------------------------------------------|
| `Waiting`    | The challenge has not been attempted or solved by that coder yet                                     |
| `Attempted`  | The challenge has been attempted which means that the coder has made a submission but it didn't pass |
| `Completed`  | The coder has successfully completed the challenge                                                   |




- The same thing should be for getting the challenge by id


#### 4. Categories listing
- Add a route to get all the existing categories
- Add the controller for that route
- Add the service that queries the database to get all the categories

