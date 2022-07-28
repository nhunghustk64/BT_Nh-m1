import qs from 'qs';
import React from 'react'
import { useState,useEffect } from 'react'
// @ts-ignore
import { RouteComponentProps,StaticContext,ChatBoardLocationState,BrowserRouter as Router,  } from "react-router-dom";
// ES modules
import {socketOnMessageList,socketOnError,socketOnVoteVis,socketOnCreatorDC} from './socketFunction'
import {io, Socket} from "socket.io-client";
import { messageValidator} from "./messageValidator";
import {socketEmitNewMessage} from "./socketEmits";
import FeedbackMessage from "./FeedbackMesseage";
interface Message {
    id: number;
    message: string | number;
}
interface PersonalVotedMessage {
    messageId:number;
    personalVotes: number;
}
interface Message {
    name: string;
}


// @ts-ignore
const [socket, setSocket] = useState<SocketIOClient.Socket>();

// @ts-ignore
 // @ts-ignore
export function Chatboard():React.FC<RouteComponentProps<any, StaticContext, ChatBoardLocationState>> // @ts-ignore
= (props: RouteComponentProps<any, StaticContext, ChatBoardLocationState>) => {
    // Return nothing if not redirected here
    if (props.location.search === "") return <div>Please create or join a room</div>;

    const [messageList, setMessageList] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const [boardId, setBoardId] = useState<string>("");
    // @ts-ignore
    const [socket, setSocket] = useState<SocketIOClient.Socket>();
    const [didCreateRoom, setDidCreateRoom] = useState<boolean>(false);
    const [redirect, setRedirect] = useState<string>("");
    const [warning, setWarning] = useState<string>();
    const [hideVotes, setHideVotes] = useState<boolean>(true);
    const [votedMessages, setVotedMessages] = useState<PersonalVotedMessage[]>([]);

    useEffect(() => {
        // @ts-ignore
        setSocket(io.connect(ENDPOINT, {query: `board=${props.boardId}`}));
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);


    useEffect(() => {
        if (!socket) {
            // @ts-ignore
            setSocket(io.connect(ENDPOINT, {query: `board=${boardId}`}));
        } else {
            socketOnVoteVis(socket, setHideVotes);
            socketOnMessageList(socket, setMessageList);
            socketOnCreatorDC(socket, setWarning, setRedirect);
            socketOnError(socket);
        }

        return () => {
            if (socket) socket.disconnect();
        };
    }, [socket]);
    const voteMessage = (message: Message, value: number) => {
        const indexOfVoted = votedMessages.findIndex(msg => msg.messageId === message.id);
        // If not in votedMessages array, add it to it and give it a personal vote of +1/-1
        // Else, update its votes
        if (indexOfVoted === -1) {
            setVotedMessages([...votedMessages, {messageId: message.id, personalVotes: value}]);
        } else {
            const votedMessage = votedMessages[indexOfVoted];
            const newVotedMessage = {...votedMessage, personalVotes: votedMessage.personalVotes + value};
            let NUM_VOTES = 0;
            if (Math.abs(newVotedMessage.personalVotes) > NUM_VOTES) return alert("Can only vote 3 times per item");
            const newVotedMessageArray = votedMessages.filter(msg => msg.messageId !== message.id);
            setVotedMessages([...newVotedMessageArray, newVotedMessage]);
        }
        socket.emit("upvote", {message, value});
    };

    const renderList = (): JSX.Element[] => {
        return messageList.map((message: Message) => {
            const indexOfVoted = votedMessages.findIndex(msg => msg.messageId === message.id);
            const personalVote = indexOfVoted === -1 ? 0 : votedMessages[indexOfVoted].personalVotes;
            return (
                <FeedbackMessage key={message.id} hideVotes={hideVotes} voteMessage={voteMessage} message={message}
                                 personalVote={personalVote}/>
            );
        });
    };

    const toggleHideVotes = () => {
        socket.emit("toggle-votes");
    };

    socket.on("toggle-votes", () => {
        setHideVotes(!hideVotes);
    });

    const handleClick = (): void => {
        const err: string | null = messageValidator(message);
        if (err) {
            alert(err);
            return;
        }
        socketEmitNewMessage(socket, message);
        setMessage("");
    };

}
    export default function ChatBoard() {
        return (
            <div>

                <h1>Helllo thầy bọn em không chạy được chương chình nhưng mà bọn em hiểu hết code rồi thầy ^^</h1>

            </div>

        )
    }

