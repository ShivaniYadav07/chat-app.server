"use strict";
const { Server } = require('socket.io');
const  axios  = require('axios');

module.exports = {
  register({ strapi }) {},

  bootstrap({ strapi }) {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });

    io.on("connection", function (socket) {
      socket.on("join", ({ username }) => {
        if (!username) {
          console.log("An error occurred");
          return;
        }

        socket.join("group");
        socket.emit("welcome", {
          user: "bot",
          text: `${username}, Welcome to the group chat`,
          userData: username,
        });
        socket.on("kick", (data) => {//Listening for a kick event
          io.sockets.sockets.forEach((socket) => {
            if (socket.id === data.socketid) {
              socket.disconnect();//Disconnecting the User
              socket.removeAllListeners();
              return console.log("kicked", socket.id, data.socketid);
            } else {
              console.log("Couldn't kick", socket.id, data.socketid);
            }
          })
        })
        const userData = { data: { users: username } };
        axios
         .post("http://localhost:1337/api/active-users", userData)
         .then((response) => {
            socket.emit("roomData", { done: "true" });
          })
         .catch((error) => {
            if (error.message === "Request failed with status code 400") {
              socket.emit("roomData", { done: "existing" });
            }
          });
      });

      socket.on("sendMessage", async (data) => {
        if (!data.user ||!data.message) {
          console.log("Invalid message data");
          return;
        }

        const messageData = { data: { user: data.user, message: data.message } };
        try {
          const response = await axios.post("http://localhost:1337/api/messages", messageData);
          socket.broadcast.to("group").emit("message", {
            user: data.username,
            text: data.message,
          });
        } catch (error) {
          console.log("Error sending message", error.message);
        }
      });
    });
  },
};