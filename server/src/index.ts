
import express from "express"
const app = express();
const http = require('http');
const server = http.createServer(app);
import { Server, Socket } from "socket.io";

import cors from 'cors';

const PORT = 5000;

app.use(cors())
app.use(express.json())

var connectionRoutes = require('./routes/connections');
var hookRoutes = require('./routes/hooks');
var commandRoutes = require('./routes/commands');
var configRoutes = require('./routes/config');

app.use('/connection', connectionRoutes);
app.use('/hooks', hookRoutes);
app.use('/command', commandRoutes);
app.use('/config', configRoutes);


app.get('/', (req: any, res: any) => {
    res.send({status: "running"});
});


server.listen(PORT, {origins: "*:*"}, () => {
    console.log(`Listening on: http://localhost:${PORT}`);
});


const ioOptions = {
    cors: {
        origins: "*:*",
        credentials: false
    }
}

export const sio = new Server(server, ioOptions);

sio.on("connection", (socket: Socket) => {
    // console.log("Client connected");

    socket.on('disconnect', (reason: any) => {
        // console.log("Client disconnected");
    });
});