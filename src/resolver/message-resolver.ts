import { IResolvers } from "graphql-tools";
import { prisma } from "../generated/prisma-client";

const resolvers : IResolvers = {
  Query:{
    messages(root,args,context){
      return prisma.messages();
    },
    messagesInRoom(root,{roomId},ctx){
      return prisma.messages({where:{inRoom:{id:roomId}},orderBy:"createdAt_DESC"})
    }
  },
  Mutation:{
    sentMessage(root, { text, userId, roomId }, context) {
      return prisma.createMessage({
        text,
        sentBy: {
          connect: { id: userId }
        },
        inRoom: {
          connect: { id: roomId }
        }
      });
    },
  },
  Subscription:{
    newMessage: {
      subscribe: (root,{roomId},ctx) => {
        return prisma.$subscribe.message({mutation_in: "CREATED",node:{inRoom:{id:roomId}}}).node()
      },
      resolve: payload => {
        return payload
      }
    }
  },
  Message: {
    sentBy(root,args,context) {
      return prisma.message({
        id: root.id
      }).sentBy()
    },
    // test(root,args,context) {
    //   return prisma.users()
    // },
    inRoom(root,args,context) {
      return prisma.message({
        id:root.id
      }).inRoom()
    }
  },

}

export default resolvers;