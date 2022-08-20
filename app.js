const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema }  = require('graphql');
const mongoose = require("mongoose");

const Event = require('./models/event');
const event = require('./models/event');

const app = express();

const arrayy = [];
  
app.use(bodyParser.json());



app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }
        
        type RootMutation{
            createEvent(eventInputt: EventInput): Event 
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then(results => {
                return results.map( event => {
                    return {...event._doc, _id: event._doc._id.toString()};
                } )
            }).catch(err => {
                throw err;
            });
        },
        createEvent: (args) => {
            const obj = new Event({
                title: args.eventInputt.title,
                description: args.eventInputt.description,
                price: args.eventInputt.price,
                date: new Date(args.eventInputt.date) 
            });
            
            return obj.save().then(result  => {
                console.log(result);

                return {...result._doc};
             }).catch(err => {
                console.log(err);
                throw err;
            });
        }        
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mxnkixx.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`).then(() =>{
                    app.listen(3000);
                    console.log("Connected to DB");
                }).catch(err => {
                    console.log(err);
                });

