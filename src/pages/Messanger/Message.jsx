import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { mobileDb, auth } from "../../../../config/firebase";
import styles from "./Message.module.css";

const Message = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchPharmacyName = async (userId) => {
    try {
      const userRef = doc(mobileDb, "users", userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists()
        ? userSnap.data().pharmacyName || "Unknown Pharmacy"
        : "Unknown Pharmacy";
    } catch (error) {
      console.error("Error fetching pharmacy name:", error);
      return "Unknown Pharmacy";
    }
  };

  const fetchUserNamesForMessages = async (msgs) => {
    const newUserNames = { ...userNames };

    await Promise.all(
      msgs.map(async (msg) => {
        const senderId = msg.senderId;
        if (!newUserNames[senderId]) {
          const name = await fetchPharmacyName(senderId);
          newUserNames[senderId] = name;
        }
      })
    );

    setUserNames(newUserNames);
  };

  useEffect(() => {
    if (!chatId) {
      console.warn("chatId is not provided!");
      return;
    }

    setLoading(true);
    const messagesRef = collection(mobileDb, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const newMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(newMessages);
        setLoading(false);

        await fetchUserNamesForMessages(newMessages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  return (
    <div className={styles.messageShow}>
      {loading ? (
        <p className={styles.loading}>Loading messages...</p>
      ) : messages.length > 0 ? (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.senderId === auth.currentUser?.uid
                ? styles.myMessage
                : styles.friendMessage
            }
          >
            <div className={styles.messageContent}>
              <p className={styles.messageText}>{msg.text}</p>
              <span className={styles.timestamp}>
                {msg.timestamp?.toDate
                  ? msg.timestamp.toDate().toLocaleString()
                  : "Sending..."}
              </span>
              <div className={styles.senderName}>
                {msg.senderId !== auth.currentUser?.uid &&
                  userNames[msg.senderId]}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noMessages}>No messages found</p>
      )}
    </div>
  );
};

export default Message;
