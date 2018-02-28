## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
2. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
3. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
4. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
5. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
6. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
7. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. In the server class, we set up a mongo client. UserController manages requests for users.
2. getUser iterates through the database of users until it finds the user with a given id
3. we can retrieve all users of a given age by passing "age" and a number to getUsers in UserController.
    filterDoc stores the parameters you want to search for, then is used to search the database
4. filterDoc, contentRegQuery,matchingUsers, and newUser. 
filterDoc- used to store query Params so that it search the data base.
contentRegQuer- used to store query params and add to filter doc.
matchingUser - is a list of users after filtering. The document comes from users.seed.json.
newUse- used to add new users to the data base.
5.clearAndPopulateDB is used in testing. Before every test, it clears the database and adds the same 
    four users to it.
6. getUsersWhoAre37 checks if getUsers returns the correct amount of users based on age(Jamie and Pat) 
7. userRequestHandler is called when api/users/new is received from the server. userRequestHandler passes the new user 
    information to userController, which adds the info to a JSON document.
