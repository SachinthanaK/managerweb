import { useState } from "react";
import styles from "./Messages.module.css";
import Chats from "./Chats";
import RightSide from "./RightSide";
import { FaSearch } from "react-icons/fa";

const Messages = () => {
  const [chatId, setChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatName, setChatName] = useState("");
  const handleSelectChat = (id, name) => {
    setChatId(id);
    setChatName(name);
  };
  return (
    <div className={styles.messenger}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch />
          </div>
          <h3>Chats</h3>
          <Chats onSelectChat={handleSelectChat} searchTerm={searchTerm} />
        </aside>
        <div className={`${styles.chatSection} ${chatId ? "" : styles.nochat}`}>
          {chatId ? (
            <RightSide chatId={chatId} chatName={chatName} />
          ) : (
            <h2>Select a chat</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

// import React, { useEffect, useState } from "react";
// import { auth } from "../../../../config/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import styles from "./Messages.module.css";
// import Friends from "./Friends";
// import RightSide from "./RightSide";

// const Messages = () => {
//   const [user, setUser] = useState(null);
//   const [chatId, setChatId] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className={styles.messenger}>
//       <div className={styles.container}>
//         <aside className={styles.sidebar}>
//           <h3>Friends</h3>
//           <Friends onSelectChat={(id) => setChatId(id)} />
//         </aside>
//         {chatId ? <RightSide chatId={chatId} /> : <p>Select a chat</p>}
//       </div>
//     </div>
//   );
// };

// export default Messages;

// import React, { useEffect, useState } from "react";
// import { FaEllipsisH, FaEdit, FaSearch } from "react-icons/fa";
// import { auth, db } from "../../../../config/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import styles from "./Messages.module.css";
// import Friends from "./Friends";
// import RightSide from "./RightSide";

// const Messages = () => {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("");
//   const [chatId, setChatId] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);

//         if (currentUser.email) {
//           try {
//             const userRef = doc(db, "users", currentUser.email);
//             const userSnap = await getDoc(userRef);

//             if (userSnap.exists()) {
//               setName(userSnap.data().name || "Unknown");
//               setRole(userSnap.data().role || "User");
//             }
//           } catch (error) {
//             console.error("Error fetching user data:", error);
//           }
//         }
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <div className={styles.messenger}>
//       <div className={styles.container}>
//         <aside className={styles.sidebar}>
//           <div className={styles.profileSection}>
//             <div className={styles.profile}>
//               <div className={styles.avatar}>
//                 {name ? name.charAt(0).toUpperCase() : "?"}
//               </div>
//               <div>
//                 <h3>{name || "Guest"}</h3>
//                 <p>{role || "User"}</p>
//               </div>
//             </div>
//             <div className={styles.icons}>
//               <FaEllipsisH className={styles.icon} />
//               <FaEdit className={styles.icon} />
//             </div>
//           </div>

//           <div className={styles.searchBar}>
//             <FaSearch className={styles.searchIcon} />
//             <input
//               type="text"
//               placeholder="Search"
//               className={styles.searchInput}
//             />
//           </div>

//           <div className={styles.friendsList}>
//             <Friends selectChat={setChatId} />
//           </div>
//         </aside>

//         <RightSide chatId={chatId} />
//       </div>
//     </div>
//   );
// };

// export default Messages;
