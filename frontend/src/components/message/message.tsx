interface Message {
    id: string;
    is_me: boolean;
    content: string;
  }

export default function Message({ message }: {message: Message}) {
    return (
        <div className={`rounded-xl p-2 max-w-[90%] ${message.is_me ? "bg-gray-400" : "bg-red-400"}`}>
            <p className="break-words">{message.content}</p>
        </div>
    );
}