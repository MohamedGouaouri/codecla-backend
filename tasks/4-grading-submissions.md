
## Grading
In this assignment, you are going to implement the functionality of grading a submission. This
is the most important function in the system. You are not going to implement the actual code runner, you are going
to use two code runners, one for `javascript` and `python`.

These code runners function as web services, offering a RESTful API for seamless communication. Your role will be to interface with these runners, transmitting both the submitted code and accompanying test cases. Subsequently, upon receiving this data, the runners will execute the code against the provided tests, generating comprehensive reports detailing the outcomes of these evaluations.

### Tasks
Here's the list of tasks

- Add a route to post a submission
- Protect this route so that only the coder is able to submit a code
- Add the controller for that route
- Add the validator to validate the submitted code before invoking the grader

The data provided to the grader has the following shape:
```text
{
  lang: "py" | "js".    // This is the language of the code
  code: "..."           // The coders' code 
  challenge_id: "...",  // The challenge id
}
```
An example of a code submission is:

```json
{
    "challenge_id": "65feaac34c7c0fa50a47fb3e",
    "lang": "py",
    "code": "def factorial(n):\n\tif n == 0: return 2 \n\treturn n * factorial(n-1)"
}
```
- Add the service responsible for the grading

The grader should take the submitted code and invoke the code runner service.

The `python runner` is available via this endpoint:
```http request
POST http://localhost:5000/run
```

The `javascript runner` is available via this endpoint:
```http request
POST http://localhost:5001/run
```

You should based on the language provided in the submission send the code to the appropriate service

An example of a request to the `code runner` is the following:

```json
{
    "lang": "js",
    "code": "function factorial(n) {\n    if (n === 0) return 1;\n    return n * factorial(n - 1);\n}",
    "func_name": "factorial",
    "tests": [
        {
            "_id": "1234654654654d",
            "inputs": [{ "value": 1 }],
            "output": 1
        },
        {
            "_id": "1234654654654",
            "inputs": [{ "value": 5 }],
            "output": 120
        },
        {
            "_id": "12346546544d",
            "inputs": [{ "value": 4 }],
            "output": 24
        }
    ]
}

```
**Description of code runner request:**

| Field       | Description                                                                                                                                                                                                                                     |
|-------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `lang`      | The type of programming language of the code                                                                                                                                                                                                    |
| `func_name` | The same as `function_name` of challenge's code                                                                                                                                                                                                 |
| `code`      | The coder's submitted code                                                                                                                                                                                                                      |
| `tests`     | A list of test cases, each test case with its `_id` to help the runner differentiate between tests, the `inputs` which is an array of objects with a field named `value` and finally the `output` which is the expected output of the test case |


The code runner will output either a success or error messages.
In case of a success it should return a report of the tests.

An example of the runner response

```json
{
    "status": "passed",
    "test_results": [
        {
            "message": "",
            "status": "passed",
            "test_id": "1234654654654d",
            "time": 4
        },
        {
            "message": "",
            "status": "passed",
            "test_id": "1234654654654",
            "time": 1
        },
        {
            "message": "",
            "status": "passed",
            "test_id": "12346546544d",
            "time": 0
        }
    ]
}
```

**Description of code runner response**

| Field          | Description                                                                                                                                                            |
|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `status`       | Whether the submission is `passed` or `failed`                                                                                                                         |
| `test_results` | An array that contains for each test its status whether it's `passed` or `failed`, the `test_id` and the `time` (to be ignore) which is time spent in running that test|

There are some things to consider for the grading service:

- If the coder submits a code for a challenge that he already solved, you should send a response indicating that the challenge
has already been solved.
- After successfully grading the submission, the score, should be calculated and added to submission and you should indicate that it passed the tests
- To calculate the score, use the following formula:
```
score = sum over all tests of (weight * 100)
```

- Also you should update the cumulative score for the coder (which is going to be used in the ranking)
