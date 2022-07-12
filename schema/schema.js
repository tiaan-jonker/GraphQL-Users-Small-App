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
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
} = graphql
const axios = require('axios')

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/companies/${parent.id}/users`)
          .then((res) => res.data)
      },
    },
  }),
})

// Ex query structure: 
/*
query fetchCompany {
  company(id: "1") {
    id
    name
    description
  }
}
*/

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/companies/${parent.companyId}`)
          .then((res) => res.data)
      },
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((res) => res.data)
      },
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((res) => res.data)
      },
    },
  },
})

module.exports = new GraphQLSchema({
  query: RootQuery,
})
