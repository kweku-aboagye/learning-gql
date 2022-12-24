const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors'); 
const app = express();


// Allow cross origin request
app.use(cors());

// MongoDB
mongoose.connect('[REDACTED_MONGODB_CONNECTION_STRING]');
mongoose.connection.once('open', () => {
    console.log('connected to database');
})

// GraphQL
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

// Localhost
app.listen(4000, () => {
    console.log('now listening for request on port 4000')
})