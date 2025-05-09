import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { mobileDb, auth } from "../../firebase";
import styles from "./MessageSend.module.css";

const MessageSend = ({ chatId }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim() || !chatId) return;

    try {
      await addDoc(collection(mobileDb, "chats", chatId, "messages"), {
        senderId: auth.currentUser?.uid,
        senderRole: "pharmacy",
        text: message,
        timestamp: serverTimestamp(),
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className={styles.messageSendSection}>
      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder="Type a message..."
          className={styles.formControl}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default MessageSend;

// import React, { useState } from "react";
// import { FaPaperPlane } from "react-icons/fa";
// import { mobileDb, auth } from "../../../../config/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import styles from "./MessageSend.module.css";

// const MessageSend = ({ chatId }) => {
//   const [message, setMessage] = useState("");

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         console.error("User not authenticated");
//         return;
//       }

//       await addDoc(collection(mobileDb, `chats/${chatId}/messages`), {
//         senderId: user.uid,
//         text: message,
//         timestamp: serverTimestamp(),
//       });

//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className={styles.messageSendSection}>
//       <input
//         type="text"
//         placeholder="Type a message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className={styles.formControl}
//       />
//       <button className={styles.sendButton} onClick={sendMessage}>
//         <FaPaperPlane />
//       </button>
//     </div>
//   );
// };

// export default MessageSend;
// import React, { useState } from "react";
// import { FaPaperPlane } from "react-icons/fa";
// import { mobileDb, auth } from "../../../../config/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import styles from "./MessageSend.module.css";

// const MessageSend = ({ chatId }) => {
//   const [message, setMessage] = useState("");

//   const sendMessage = async () => {
//     if (!message.trim()) return;

//     try {
//       const user = auth.currentUser;
//       if (!user) {
//         console.error("User not authenticated");
//         return;
//       }

//       await addDoc(collection(mobileDb, `chats/${chatId}/messages`), {
//         senderId: user.uid,
//         text: message,
//         timestamp: serverTimestamp(),
//       });

//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className={styles.messageSendSection}>
//       <input
//         type="text"
//         placeholder="Type a message..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         className={styles.formControl}
//       />
//       <button className={styles.sendButton} onClick={sendMessage}>
//         <FaPaperPlane />
//       </button>
//     </div>
//   );
// };

// export default MessageSend;

// import React, { useState } from "react";
// import { FaPaperPlane } from "react-icons/fa";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { mobileDb, auth } from "../../../../config/firebase";
// import styles from "./MessageSend.module.css";

// const MessageSend = ({ chatId }) => {
//   const [message, setMessage] = useState("");

//   const sendMessage = async () => {
//     if (!message.trim() || !chatId) return;

//     try {
//       await addDoc(collection(mobileDb, "chats", chatId, "messages"), {
//         senderId: auth.currentUser?.uid,
//         senderRole: "pharmacy",
//         text: message,
//         timestamp: serverTimestamp(),
//       });

//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   return (
//     <div className={styles.messageSendSection}>
//       <div className={styles.messageInput}>
//         <input
//           type="text"
//           placeholder="Type a message..."
//           className={styles.formControl}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button className={styles.sendButton} onClick={sendMessage}>
//           <FaPaperPlane />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageSend;
