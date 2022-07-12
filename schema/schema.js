// --> Data:
// USERS
// prop_name    | type
// id           | Id
// firstName    | String
// age          | String
// company_id   | Id
// position_id  | Id
// users        | [Id]

// COMPANY
// props_name   | type
// id           | Id
// name         | String
// desc         | String

// POSITION
// props_name   | type
// id           | Id
// name         | String
// desc         | String

const graphql = require('graphql')
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql
const _ = require('lodash')

const Users = [
  { id: '23', firstName: 'Bob', age: 20 },
  { id: '47', firstName: 'Gill', age: 30 },
  { id: '69', firstName: 'Bill', age: 40 },
]

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return Users.find()
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // where it goes into the DB reaching to grab data
      // parent ->
      resolve(parent, args) {
        return _.find(Users, { id: args.id })
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
