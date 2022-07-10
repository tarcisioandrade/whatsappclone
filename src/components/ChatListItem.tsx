import React, { useEffect, useState } from "react";
import { ChatListProp } from "../App";
import "./ChatListItem.css";

type ChatProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  active: boolean;
  data: ChatListProp;
};

const ChatListItem = ({ onClick, active, data }: ChatProps) => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    if (data.lastMessageDate) {
      const firebaseTime = new Date(
        data.lastMessageDate.seconds * 1000 +
          data.lastMessageDate.nanoseconds / 1000000
      );
      setTime(firebaseTime.toLocaleTimeString("pt-BR"));
    }
  }, [data, data.lastMessageDate]);

  return (
    <div className={`chatListItem ${active ? "active" : ""}`} onClick={onClick}>
      <img className="chatListItem--avatar" src={data.image} alt="" />
      <div className="chatListItem--lines">
        <div className="chatListItem--line">
          <div className="chatListItem--name">{data.title}</div>
          <div className="chatListItem--date">{time}</div>
        </div>
        <div className="chatListItem--line">
          <div className="chatListItem--lastMsg">
            <p>{data.lastMessage}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
