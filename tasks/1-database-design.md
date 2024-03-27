## Database design
In this assignment, you are going to design the database schemas and their relationships to
model the data of the coding platform. We are going to provide with a textual description of the entities and you're asked
to do the subsequent tasks


### CodeCLA database description
he platform caters to two primary user roles: **Coders** and **Managers**. Managers hold the responsibility of overseeing their designated 
**Challenges** by creating, updating, and deleting them. 
Both **Coders** and **Managers** possess basic account information such as first name, last name, email, password, and an optional avatar. 
Coders, however, have additional pertinent attributes including a description field allowing them to express their passion and interests, and a score field crucial for the application's 
**Leaderboard**.


The **Challenge** entity represents a coding challenge and includes attributes such as a title, category (e.g., data structures, graphs), 
and a textual description provided by the **Manager** in Markdown format for enhanced UI rendering. 
**Challenges** are also categorized by difficulty level, which can be one of the following: `Easy`, `Moderate`, or `Hard`. 
Each **Challenge** includes an associated **Code** snippet, initially provided by the **Manager**, which serves as a starting point for **Coders** to build upon and submit their solutions. 
Additionally, **Challenges** are accompanied by a set of **TestCases**.

The **Code** contains information related to the function that **Coders** are required to implement. 
This includes a function name and the actual **code content**, organized by language. Each Code entity also defines a set of **FunctionInputDefinitions**, which describe the function's arguments. 
These **FunctionInputDefinitions** consist of a name and a type, aiding **Coders** in understanding the expected function signature.

**TestCases** are used to evaluate Coders' submissions against predefined inputs and expected outputs. 
Each **TestCase** is assigned a weight value between 0 and 1, indicating its importance relative to other TestCases. Furthermore, **TestCases** consist of a set of **FunctionInputValues** representing the inputs for the function being tested, each with a name and corresponding value.


### Tasks
Here's the list of tasks

- Extract the entities along with their relationships.
- Draw the diagram of the system.

