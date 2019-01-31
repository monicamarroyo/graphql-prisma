import '@babel/polyfill/noConflict';
import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import {resolvers,fragmentReplacements} from './resolvers/index'
//this makes sure our start script executes
import prisma from './prisma'; // this just runs the file
//in order to use fragment

const pubsub = new PubSub()

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            db,
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
})
//this starts the localhost:4000 by default but graphql-yoga has oter ooptions for deploying to heroku
//our app works on heroku and locally on 4000
server.start({port: process.env.PORT || 4000},() => {
    console.log('The server is up!')
})


    /* 
    context: {
        db,
        pubsub,
        prisma
    }
    */
 /*
    //this gets passed in as value for 3rd arguemtn it can be set to a function
    //why we have this as a function, this gets sent to our resolvers, query,mutation, 
    context(request) {
        //this is the information that gets sent to prisma 
        //requestt
        //console.log(request.request.headers);
        return {
            db,
            pubsub,
            prisma,
            request
        }
    }
    */