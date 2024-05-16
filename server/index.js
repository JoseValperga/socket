import express from "express";
import http from "http"; //servidor http de Node
import { Server as SocketServer } from "socket.io";
const PORT = 4000;

const app = express(); //este servidor no es compatible con los websockets
const server = http.createServer(app); //asi que aqui lo hago servidor http basico

//servidor de websocket - utilizo cors para permitir conexion con el front
//por otra parte, si necesito que server y front estén juntos
//en la misma aplicación, puedo modificar vite.config.js
//agregando un proxy y dejando  const io = new SocketServer(server)
//agrego el proxy en vite.config para dejar el ejemplo
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

//Ahora a escuchar cuando un cliente se conecta en el frontend
io.on("connection", (socket) => {
  console.log(socket.id);

  //verifico si escucho un mensaje de entrada (evento)
  socket.on("message", (body) => {

    //reenvío el mensaje (que es un objeto)
    //a los conectados
    console.log("DATA ", body);
    socket.broadcast.emit("message", {
      body,
      from: socket.id
    });
  });
});

//app.listen(3000) no quiero que el servidor http escuche
server.listen(PORT);
console.log(`Listen PORT: ${PORT}`);
