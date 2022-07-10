import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useState, useEffect } from "react";
import { ADD_NEW_CHAT, GET_CONTACT_LIST } from "../../Api";
import { ChatListProp, UserType } from "../App";
import "./NewChat.css";

interface NewChatProps {
  show: boolean;
  setShow: Function;
  user: UserType;
  chatList: ChatListProp[];
}
const NewChat = ({ show, setShow, user, chatList }: NewChatProps) => {
  const [list, setList] = useState<UserType[]>([]);

  useEffect(() => {
    const getList = async () => {
      if (user !== null) {
        const results = await GET_CONTACT_LIST(user.id);
        setList(results);
      }
    };
    getList();
  }, [user]);

  const handleClose = () => {
    setShow(false);
  };

  const addNewChat = async (user2: UserType) => {
    await ADD_NEW_CHAT(user, user2);

    handleClose()
  }

  return (
    <div className="newChat" style={{ left: show ? "0" : "-415px" }}>
      <div className="newChat--head">
        <div className="newChat--backbutton" onClick={handleClose}>
          <ArrowBackIcon style={{ color: "#fff" }} />
        </div>
        <div className="newChat--headtitle">Nova Conversa</div>
      </div>
      <div className="newChat-list">
        {list.map((item, key) => (
          <div onClick={() => addNewChat(item)} className="newChat--item" key={key}>
            <img className="newChat--itemavatar" src={item.avatar} alt="" />
            <div className="newChat--itemname">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewChat;
