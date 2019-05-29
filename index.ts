import { prisma } from "./src/generated/prisma-client";
import { GraphQLServer } from "graphql-yoga";
import { IResolvers } from "graphql-tools";
import { importSchema } from "graphql-import";
console.log(importSchema("./schema.graphql"));

const resolvers: IResolvers = {
  Query: {
    users(root, args, context) {
      return prisma.users();
    },
    user(root, { where }, context) {
      return prisma.user(where);
    },
    rooms(root, args, context) {
      return prisma.rooms({});
    },
    room(root, { where }, context) {
      return prisma.room(where);
    },
    messages(root,args,context){
      return prisma.messages();
    },
    messagesInRoom(root,{roomId},ctx){
      return prisma.messages({where:{inRoom:{id:roomId}}})
    }

  },
  Mutation: {
    createUser(root, { data }, context) {
      return prisma.createUser(data);
    },
    createRoom(root, { data }, context) {
      return prisma.createRoom(data);
    },
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
  Subscription: {
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
    inRoom(root,args,context) {
      return prisma.message({
        id:root.id
      }).inRoom()
    }
  },
  User: {
    rooms(root,args,context) {
      return prisma.user({id:root.id}).rooms()
    }
  },
  Room: {
    users(root,args,context) {
      return prisma.room({id:root.id}).users()
    }
  }

};

const server = new GraphQLServer({
  typeDefs: importSchema("./schema.graphql"),
  resolvers,
  context: {
    prisma
  }
});
server.start(() => console.log("Server is running on http://localhost:4000"));
