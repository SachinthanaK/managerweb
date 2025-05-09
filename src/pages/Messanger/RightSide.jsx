import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import styles from "./RightSide.module.css";
import Message from "./Message";
import MessageSend from "./MessageSend";

const RightSide = ({ chatId, chatName }) => {
  return (
    <div className={styles.rightSide}>
      <div className={styles.header}>
        <div className={styles.userProfile}>
        <div className={styles.userAvatar}>
          {chatName?.charAt(0).toUpperCase() || "C"}
        </div>

          <h3 className={styles.userName}>{chatName || "Chat"}</h3>
        </div>
        <div className={styles.icons}>
          <FaPhoneAlt className={styles.icon} />
        </div>
      </div>
      <Message chatId={chatId} />
      <MessageSend chatId={chatId} />
    </div>
  );
};


export default RightSide;

// import React from "react";
// import { FaPhoneAlt } from "react-icons/fa";
// import styles from "./RightSide.module.css";
// import Message from "./Message";
// import MessageSend from "./MessageSend";

// const RightSide = ({ chatId }) => {
//   return (
//     <div className={styles.rightSide}>
//       <div className={styles.header}>
//         <h3>Chat</h3>
//         <FaPhoneAlt className={styles.icon} />
//       </div>
//       <Message chatId={chatId} />
//       <MessageSend chatId={chatId} />
//     </div>
//   );
// };

// export default RightSide;

// import React from "react";
// import { FaPhoneAlt, FaVideo } from "react-icons/fa";
// import styles from "./RightSide.module.css";
// import Message from "./Message";
// import MessageSend from "./MessageSend";

// const RightSide = () => {
//   return (
//     <div className={styles.rightSide}>
//       <div className={styles.header}>
//         <div className={styles.userProfile}>
//           <img src="/image.png" alt="User" className={styles.userAvatar} />
//           <h3 className={styles.userName}>Name</h3>
//         </div>
//         <div className={styles.icons}>
//           <FaPhoneAlt className={styles.icon} />
//         </div>
//       </div>
//       <Message />
//       <MessageSend />
//     </div>
//   );
// };

// export default RightSide;
