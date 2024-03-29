# fs-graphql-node-react

This is a sample fullstack project demonstrating a fullstack usage of GraphQL APIs. Using React(TS) frontend, it connects to Node Express server that has MongoDB as database.

This project was created using node v18.14.2
Steps to run in dev mode:
1. npm install
2. rename .env-sample to .env and set your environment/project variables.
3. npm start
4. optionally use the graphQL UI at http://localhost:4000/graphql


Testing with authentication
You can use postman to attach jwt to endpoints requiring auth.
1. Go to headers tab for you api
2. Content Type: `Authorization`
3. Value: `Bearer <jwt token>`


API without 3rd party libs
```
const requestBody = {
  query: `
    mutation {
      createUser(userInput: {
        email: "john@j.com", 
        password: "test123"
      })
    }
  `
}
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  body: JSON.stringify(requestBody),
  headers: {
    'Content-Type': 'application/json',

  }
}).then(res => {
  if (res.status !== 200 || res.status !== 201) {
    throw new Error('Failed!');
    return res.json();
  }
}).then(resData => {
  console.log(resData);  
}).catch( err => {
  console.log(err);
})
```