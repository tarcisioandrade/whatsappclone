import { useEffect, useState } from "react";
import { UserType } from "../App";
import { ListTypes } from "./ChatWindow";
import "./MessageItem.css";

interface MessageType {
  data: ListTypes;
  user: UserType;
}

const MessageItem = ({ data, user }: MessageType) => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (data.date) {
      const firebaseTime = new Date(
        data.date.seconds * 1000 + data.date.nanoseconds / 1000000
      );
      setTime(firebaseTime.toLocaleTimeString("pt-BR"));
    }
  }, [data, data.date]);

  return (
    <div
      className="messageLine"
      style={{
        justifyContent: user.id === data.author ? "flex-end" : "flex-start",
      }}
    >
      <div
        className="messageItem"
        style={{
          backgroundColor: user.id === data.author ? "#dcf8c6" : "#fff",
        }}
      >
        <div className="messageText">{data.body}</div>
        <div className="messageDate">{time}</div>
      </div>
    </div>
  );
};

export default MessageItem;
