import { IResolvers } from "graphql-tools";
import { prisma } from "../generated/prisma-client";
const resolvers : IResolvers = {
  Query:{
    users(root, args, context) {
      return prisma.users();
    },
    user(root, { where }, context) {
      return prisma.user(where);
    },
  },
  Mutation:{
    createUser(root, { data }, context) {
      return prisma.createUser(data);
    },

  },
  
  User: {
    rooms(root,args,context) {
      return prisma.user({id:root.id}).rooms()
    }
  },
  
}

export default resolvers