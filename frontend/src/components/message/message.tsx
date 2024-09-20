interface Message {
  id: string;
  is_me: boolean;
  content: string;
}

export default function Message({ message }: { message: Message }) {
  return (
    <div
      className={`rounded-2xl p-2 max-w-[90%] ${
        message.is_me ? "bg-[#F1F1F1] text-black" : "bg-red-400 text-white"
      }`}
    >
      <p className="break-words">{message.content}</p>
    </div>
  );
}
