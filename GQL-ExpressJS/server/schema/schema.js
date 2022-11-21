const graphql = require('graphql');
const _ = require('lodash');
const { resolve } = require('path');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const Book = require('../models/book');
const Author = require('../models/author');

// dummy data - DEPRECATED AND USING MONGODB NOW 
// --------------------------------------------------------
var books = [
    {name: 'A1', genre: 'A', id: '1', authorId: '1'},
    {name: 'A2', genre: 'A', id: '2', authorId: '2'},
    {name: 'B3', genre: 'B', id: '3', authorId: '3'},
    {name: 'A4', genre: 'A', id: '4', authorId: '2'},
    {name: 'A5', genre: 'A', id: '5', authorId: '3'},
    {name: 'A6', genre: 'A', id: '6', authorId: '3'}
];

var authors = [
    {name: 'X', age: 18, id: '1'},
    {name: 'Y', age: 19, id: '2'},
    {name: 'Z', age: 20, id: '3'},
];
// --------------------------------------------------------

// Object Types
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        age: { type: GraphQLInt},
        books: { 
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({
                    authorId: parent.id
                });
            }
        
        }

    })
});

// Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                // code to GET data from DB
                return Book.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({})
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                // code to get data from DB
                return Author.findById(args.id)
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({})
            }
        },
    }
});

// Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
               // code to add data to mongoDB
               let book = new Book({
                name: args.name,
                genre: args.genre,
                authorId: args.authorId
            });
            return book.save();
            }
        },
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                // code to add data to mongoDB
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
