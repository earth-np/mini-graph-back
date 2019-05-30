import { IResolvers } from "graphql-tools";
import { prisma } from "../generated/prisma-client";

const resolvers : IResolvers = {
  Query:{
    rooms(root, args, context) {
      return prisma.rooms({});
    },
    room(root, { where }, context) {
      return prisma.room(where);
    },
  },
  Mutation:{
    createRoom(root, { data }, context) {
      return prisma.createRoom(data);
    },
    async joinRoom(root, { userId, roomId }, context) {
      console.log(userId,roomId);
      return await prisma.updateRoom({
        data: {
          users: {
            connect:{
              id: userId
            }
          }
        },
        where: {
          id: roomId
        }
      });
    }
  },
  
  Room: {
    users(root,args,context) {
      return prisma.room({id:root.id}).users()
    }
  }
  
}

export default resolvers