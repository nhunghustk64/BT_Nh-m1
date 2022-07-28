// @ts-ignore
interface Message {
    id: number;
    message: string | number;
}
export  default function FeedbackMessage(props: { voteMessage: (message: Message, value: number) => void, hideVotes: boolean, message: Message, personalVote: number }) {
    return null;
}