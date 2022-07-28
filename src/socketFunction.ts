// Listeners

import { io, SocketIOClient } from "socket.io-client";
interface Message {
    id: number;
    message: string | number;
}
export const socketOnMessageList
    = (socket: SocketIOClient.Socket, setMessageList: (messageList: Message[]) => void): void => {
    socket.on("message", (messageList: Message[]) => {
        setMessageList(messageList);
    });
};

export const socketOnError
    = (socket: SocketIOClient.Socket): void => {
    socket.on("error", (errorMessage: string) => {
        alert(`Error: ${errorMessage}`);
    });
};

export const socketOnVoteVis
    = (socket: SocketIOClient.Socket, setHideVotes: (hideVotes: boolean) => void): void => {
    socket.on("toggle-votes", (newVoteVis: boolean) => {
        console.log("TOGGLEED VOTES");
        setHideVotes(newVoteVis);
    });
};

export const socketOnCreatorDC
    = (socket: SocketIOClient.Socket, setWarning:(str: string) => void, setRedirect: (str: string) => void): void => {
    socket.on("creator-disconnect", (message: {msg: string, timeout: number}) => {
        setWarning(message.msg);
        setTimeout(() => {
            socket.close();
            setWarning("");
            setRedirect("/");
        }, message.timeout);
    });
};