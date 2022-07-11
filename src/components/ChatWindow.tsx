import { useState, useEffect, useRef } from "react";
import { ChatListProp, UserType } from "../App";
import { ON_CHAT_CONTENT, SEND_MESSAGE } from "../Api";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import EmojiPicker from "emoji-picker-react";
import MessageItem from "./MessageItem";

import "./ChatWindow.css";

export interface ListTypes {
  author: string;
  body: string;
  date: {
    seconds: number;
    nanoseconds: number;
  };
}

interface ChatProps {
  user: UserType;
  data: ChatListProp;
}

const ChatWindow = ({ user, data }: ChatProps) => {
  const [emojiOpen, setEmojiOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [list, setList] = useState<ListTypes[]>([]);
  const [users, setUsers] = useState([]);
  const body = useRef<any>(null);

  useEffect(() => {
    if (body.current.scrollHeight > body.current.offsetHeight) {
      body.current.scrollTop =
        body.current.scrollHeight - body.current.offsetHeight;
    }
  }, [list]);

  useEffect(() => {
    setList([]);
    const unsub = ON_CHAT_CONTENT(data.chatId, setList, setUsers);
    return unsub;
  }, [data.chatId]);

  const handleEmojiClick = (e: any, emojiObject: { emoji: string }) => {
    setText(text + emojiObject.emoji);
  };

  const handleInputKeyUp = (e: any) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };
  const handleSendClick = () => {
    if (text !== "") {
      SEND_MESSAGE(data, user.id, "text", text, users);
      setText("");
      setEmojiOpen(false);
    }
  };

  return (
    <div className="chatWindow">
      <div className="chatWindow--header">
        <div className="chatWindow--headerinfo">
          <img className="chatWindow--avatar" src={data.image} alt="" />
          <div className="chatWindow--name">{data.title}</div>
        </div>

        <div className="chatWindow--headerbuttons">
          <div className="chatWindow--btn">
            <SearchIcon style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn">
            <AttachFileIcon style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn">
            <MoreVertIcon style={{ color: "#919191" }} />
          </div>
        </div>
      </div>
      <div ref={body} className="chatWindow--body">
        {list.map((item, key) => (
          <MessageItem key={key} data={item} user={user} />
        ))}
      </div>
      <div
        className="chatWindow--emojiarea"
        style={{ height: emojiOpen ? "200px" : "0px" }}
      >
        <EmojiPicker
          disableSearchBar
          disableSkinTonePicker
          onEmojiClick={handleEmojiClick}
        />
      </div>
      <footer className="chatWindow--footer">
        <div className="chatWindow--pre">
          <div
            className="chatWindow--btn"
            onClick={() => setEmojiOpen(false)}
            style={{ width: emojiOpen ? "40px" : "0px" }}
          >
            <CloseIcon style={{ color: "#919191" }} />
          </div>
          <div className="chatWindow--btn" onClick={() => setEmojiOpen(true)}>
            <InsertEmoticonIcon
              style={{ color: emojiOpen ? "#009688" : "#919191" }}
            />
          </div>
        </div>
        <div className="chatWindow--inputarea">
          <input
            className="chatWindow--input"
            type="text"
            placeholder="Mensagem"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleInputKeyUp}
          />
        </div>
        <div className="chatWindow--pos">
          {text === "" ? (
            <div className="chatWindow--btn">
              <MicIcon style={{ color: "#919191" }} />
            </div>
          ) : (
            <div onClick={handleSendClick} className="chatWindow--btn">
              <SendIcon style={{ color: "#919191" }} />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
