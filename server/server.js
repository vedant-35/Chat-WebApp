import express from 'express';
import cors from 'cors';
import {Server} from 'socket.io';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`user with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    });
});

app.use(cors());

server.listen(3001, () => {
  console.log('listening on *:3001');
})