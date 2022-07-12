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
  GraphQLNonNull,
} = graphql
const axios = require('axios')

// * ------------ QUERIES

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
  google: company(id: "1") {
    ...companyDetails
  }
  microsoft: company(id: "1") {
    ...companyDetails
  }
}

fragment companyDetails on Company {
  id
  name
  description
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

// Ex query structure:
/*
query fetchCompany {
  one: user(id: "23") {
    ...userDetails
  }
  two: user(id: "47") {
    ...userDetails
  }
}

fragment userDetails on User {
  id
  firstName
  age
}
*/

// * ------------ MUTATIONS

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLString) },
        companyId: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { firstName, age }) {
        return axios
          .post(`http://localhost:3000/users`, {
            firstName,
            age,
          })
          .then((res) => res.data)
      },
    },

    deleteUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => res.data)
      },
    },

    editUser: {
      type: UserType,
      args: {
        id: { type: GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLString },
        companyId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then((res) => res.data)
      },
    },
  },
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
  mutation,
})
