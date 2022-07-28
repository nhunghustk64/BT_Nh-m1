//In legacy, you would write like this:
import  {SocketIOClient} from 'socket.io-client';


//Now, you could easily write this inside the body of a function component:

export const socketEmitNewMessage = (socket: SocketIOClient.Socket, message: string): void => {
    const user: string = socket.id;
    const newMessage = {user, message, upvotes: 0};
    socket.emit("message", newMessage);
};