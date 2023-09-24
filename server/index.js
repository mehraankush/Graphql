const express = require('express');
const { ApolloServer } = require('@apollo/server')
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressMiddleware } = require('@apollo/server/express4');
const { default: axios } = require('axios');

const {USERS } = require('./users')
const {TODOS } = require('./posts')



async function startserver(){

    const app = express();  
    const server = new ApolloServer({
         typeDefs:`
         type User{
          id:ID!
          name:String!
          username:String!
          email:String!
          phone:String!
          website:String
         }
          type Todo {
             id:ID!
             title:String!
             completed:Boolean
             user:User
          }

          type Query {
            getTodos:[Todo]
            getAllUsers:[User]
            getUser(id:ID!):User
          }

         `,
         resolvers:{
          Todo:{
            user:async (todo) => USERS.find((e)=>e.id===todo.id),
          },
          Query:{
            getTodos: () => TODOS,
            getAllUsers: () =>USERS,
            getUser: (parent,{id}) => USERS.find((e)=>e.id===id),
          }
         }
    }); 
    
    app.use(bodyParser.json());
    app.use(cors());
    
    // app.get('/',(req,res)=>{
    //     res.send('hello Graphql');
    // })
    
    await server.start();
    app.use('/graphql',expressMiddleware(server))

    app.listen(8000,()=>{ 
        console.log("Server Running at 8000");
    })
}

startserver();

