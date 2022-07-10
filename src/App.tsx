import { useEffect, useState } from "react";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import "./App.css";
import ChatListItem from "./components/ChatListItem";
import ChatIntro from "./components/ChatIntro";
import ChatWindow from "./components/ChatWindow";
import NewChat from "./components/NewChat";
import Login from "./components/Login";
import { ADD_USER, ON_CHAT_LIST } from "../Api";

export interface ChatListProp {
  chatId: number;
  title: string;
  image: string;
  lastMessage: string;
  lastMessageDate: {
    nanoseconds: number;
    seconds: number;
  };
}

export interface UserType {
  id: string;
  avatar: string;
  name: string;
}

interface UserFacebookProps {
  uid: string;
  displayName: string;
  photoURL: string;
}

function App() {
  const [chatList, setChatList] = useState<ChatListProp[]>([]);
  const [activeChat, setActiveChat] = useState<ChatListProp>();
  const [user, setUser] = useState<UserType | null>({
    id: "5sCNlDzYiFWz0mKxBaOtAvgyIZy1",
    avatar: "https://graph.facebook.com/2008684342674691/picture",
    name: "Tarcisio Andrade",
  });
  const [showNewChat, setShowNewChat] = useState<boolean>(false);

  const handleLoginData = async (user: UserFacebookProps) => {
    let newUser = {
      id: user.uid,
      name: user.displayName,
      avatar: user.photoURL,
    };
    await ADD_USER(newUser);
    setUser(newUser);
  };

  useEffect(() => {
    if (user !== null) {
      const unsub = ON_CHAT_LIST(user.id, setChatList);
      return unsub;
    }
  }, [user]);

  if (user === null) return <Login onReceive={handleLoginData} />;
  return (
    <div className="app-window">
      <aside className="sidebar">
        <NewChat
          show={showNewChat}
          setShow={setShowNewChat}
          user={user}
          chatList={chatList}
        />
        <header>
          <img className="header--avatar" src={user.avatar} alt="" />
          <div className="header--buttons">
            <div className="header--btn">
              <DonutLargeIcon style={{ color: "#919191" }} />
            </div>
            <div className="header--btn" onClick={() => setShowNewChat(true)}>
              <ChatIcon style={{ color: "#919191" }} />
            </div>
            <div className="header--btn">
              <MoreVertIcon style={{ color: "#919191" }} />
            </div>
          </div>
        </header>
        <div className="search">
          <div className="search--input">
            <SearchIcon fontSize="small" style={{ color: "#919191" }} />
            <input
              type="search"
              placeholder="Proucurar ou começar uma nova conversa"
            />
          </div>
        </div>
        <div className="chatList">
          {chatList.map((item, key) => (
            <ChatListItem
              onClick={() => setActiveChat(chatList[key])}
              data={item}
              active={activeChat?.chatId === chatList[key].chatId}
              key={key}
            />
          ))}
        </div>
      </aside>
      <div className="contentarea">
        {activeChat?.chatId ? (
          <ChatWindow user={user} data={activeChat} />
        ) : (
          <ChatIntro />
        )}
      </div>
    </div>
  );
}

export default App;
