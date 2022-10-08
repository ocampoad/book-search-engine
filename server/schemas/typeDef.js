const { gql } = require('apollo-server-express');

const typeDefs = gql `
    type Query {
        me: [User]
    }

    type Mutation {
        login(email: String!, password: String!): [Auth]
        addUser(username: String!, email: String!, password: String!): [Auth]
        saveBook()
    }
`;