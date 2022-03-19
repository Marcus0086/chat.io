import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../../src/next";
import { Server } from "socket.io";

const SocketHandler = async (_: NextApiRequest, res: NextApiResponseServerIO) => {
    if (!res.socket.server.io) {
        console.log("New Socket.io server...");
        const httpServer = res.socket.server as any;
        const io = new Server(httpServer, {
            path: "/api/socket",
        });
        res.socket.server.io = io;
        io.on('connect', () => {
            console.log('Connected server')
        })
    }
    res.end();
};

export default SocketHandler