import { initializeApp } from "firebase/app";
import {
  doc,
  setDoc,
  getFirestore,
  getDocs,
  collection,
  updateDoc,
  arrayUnion,
  addDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { FacebookAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const provider = new FacebookAuthProvider();

const LOGIN_FACEBOOK = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error) {
    console.log(error.message);
  }
};

const ADD_USER = async (user) => {
  await setDoc(
    doc(db, "users", user.id),
    {
      name: user.name,
      avatar: user.avatar,
    },
    { merge: true }
  );
};

const GET_CONTACT_LIST = async (userId) => {
  let list = [];

  const results = await getDocs(collection(db, "users"));

  results.forEach((result) => {
    const data = result.data();

    if (result.id !== userId) {
      list.push({
        id: result.id,
        name: data.name,
        avatar: data.avatar,
      });
    }
  });

  return list;
};

const ADD_NEW_CHAT = async (user, user2) => {
  const newChat = await addDoc(collection(db, "chats"), {
    messages: [],
    users: [user.id, user2.id],
  });

  updateDoc(doc(db, "users", user.id), {
    chats: arrayUnion({
      chatId: newChat.id,
      title: user2.name,
      image: user2.avatar,
      with: user2.id,
    }),
  });

  updateDoc(doc(db, "users", user2.id), {
    chats: arrayUnion({
      chatId: newChat.id,
      title: user.name,
      image: user.avatar,
      with: user.id,
    }),
  });
};

const ON_CHAT_LIST = (userId, setChatList) => {
  return onSnapshot(doc(db, "users", userId), (doc) => {
    if (doc.exists) {
      const data = doc.data();
      if (data.chats) {
        const chats = [...data.chats];

        chats.sort((a, b) => {
          if (a.lastMessageDate === undefined) {
            return -1;
          }
          if (b.lastMessageDate === undefined) {
            return -1;
          }
          if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
            return 1;
          } else {
            return -1;
          }
        });

        setChatList(chats);
      }
    }
  });
};

const ON_CHAT_CONTENT = (chatId, setList, setUsers) => {
  return onSnapshot(doc(db, "chats", chatId), (doc) => {
    if (doc.exists) {
      const data = doc.data();
      setList(data.messages);
      setUsers(data.users);
    }
  });
};

const SEND_MESSAGE = async (chatData, userId, type, body, users) => {
  const now = new Date();
  updateDoc(doc(db, "chats", chatData.chatId), {
    messages: arrayUnion({
      type,
      author: userId,
      body,
      date: now,
    }),
  });

  for (let i in users) {
    const u = await getDoc(doc(db, "users", users[i]));
    const uData = u.data();
    if (uData.chats) {
      const chats = [...uData.chats];
      for (let i in chats) {
        if (chats[i].chatId === chatData.chatId) {
          chats[i].lastMessage = body;
          chats[i].lastMessageDate = now;
        }
      }

      await updateDoc(doc(db, "users", users[i]), {
        chats,
      });
    }
  }
};

export {
  LOGIN_FACEBOOK,
  ADD_USER,
  GET_CONTACT_LIST,
  ADD_NEW_CHAT,
  ON_CHAT_LIST,
  ON_CHAT_CONTENT,
  SEND_MESSAGE,
};
