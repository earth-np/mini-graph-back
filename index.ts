import { prisma } from "./src/generated/prisma-client";
import { GraphQLServer } from "graphql-yoga";
import { IResolvers } from "graphql-tools";
import { importSchema } from "graphql-import";
import  resolvers  from './src/resolver/index';




const server = new GraphQLServer({
  typeDefs: importSchema("./schema.graphql"),
  resolvers,
  context: {
    prisma
  }
});
server.start(() => console.log("Server is running on http://localhost:4000"));
