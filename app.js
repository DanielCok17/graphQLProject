const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");

const qaphQlSchema = require('./qraphql/schema/index');
const qaphQlResolvers = require('./qraphql/resolvers/index');

const app = express();
  
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
    schema: qaphQlSchema,
    rootValue: qaphQlResolvers,
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mxnkixx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() =>{
                    app.listen(3000);
                    console.log("Connected to DB");
                }).catch(err => {
                    console.log(err);
                });

