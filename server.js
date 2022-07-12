const express = require('express')
const { graphqlHTTP } = require('express-graphql')

const server = express()

server.use(
  '/graphql',
  graphqlHTTP({
    graphiql: true,
  })
)

server.listen(4000, () => {
  console.log('Listening on port 4000')
})
