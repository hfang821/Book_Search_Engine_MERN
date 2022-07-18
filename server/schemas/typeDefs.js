//import gql tagged template function
const {gql} = require('apollo-server-express');

//create our typeDefs
const typeDefs = gql`
    type User{
        _id: ID
        username: String
        email: String
        savedBooks: [Book]
        bookCount: String
    }

    type Book{
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    input InputBook {
        authors: [String]
        description: String
        title: String
        bookId: ID!
        image: String
        link: String
    }

    type Query {
        me: User
    }

    type Mutation{
        login(email: String!, password: String!): Auth
        createUser(username: String!,email: String!, password: String): Auth
        saveBook (bookData: InputBook!): User
        removeBook(bookId: ID!): User
    }

    type Auth{
        token: ID!
        user: User
    }
`;

//export the typeDefs
module.exports = typeDefs;