import React, { useState, useEffect } from "react";
import { mobileDb } from "../firebase";
import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const ChatManager = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(
      collection(mobileDb, "chats", userId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [userId]);

  const sendMessage = async () => {
    if (newMessage.trim() !== "") {
      await addDoc(collection(mobileDb, "chats", userId, "messages"), {
        senderId: "manager",
        senderRole: "manager",
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat with Pharmacy {userId}</h2>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: "1px solid gray",
          padding: "10px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              textAlign: msg.senderRole === "manager" ? "right" : "left",
            }}
          >
            <p
              style={{
                background:
                  msg.senderRole === "manager" ? "lightblue" : "lightgray",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              {msg.text}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatManager;
