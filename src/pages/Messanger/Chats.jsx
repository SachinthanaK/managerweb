import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { mobileDb } from "../../../../config/firebase";
import styles from "./Friends.module.css";

const Chats = ({ onSelectChat, searchTerm }) => {
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const fetchPharmacyOwners = async () => {
      try {
        const ownersRef = collection(mobileDb, "pharmacyOwners");
        const snapshot = await getDocs(ownersRef);
        const pharmacyData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPharmacies(pharmacyData);
      } catch (error) {
        console.error("Error fetching pharmacy owners:", error);
      }
    };

    fetchPharmacyOwners();
  }, []);

  const filteredPharmacies = pharmacies.filter((pharmacy) =>
    pharmacy.pharmacyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {filteredPharmacies.length > 0 ? (
        filteredPharmacies.map((pharmacy) => (
          <div
            key={pharmacy.id}
            className={styles.friend}
            onClick={() => onSelectChat(pharmacy.id, pharmacy.pharmacyName)}
          >
            <div className={styles.avatar}>
              <span>{pharmacy.pharmacyName?.charAt(0).toUpperCase()}</span>
            </div>
            <div className={styles.friendInfo}>
              <h4 className={styles.friendName}>{pharmacy.pharmacyName}</h4>
            </div>
          </div>
        ))
      ) : (
        <p className={styles.noResults}>No pharmacies found</p>
      )}
    </div>
  );
};

export default Chats;



// import React, { useEffect, useState } from "react";
// import { mobileDb } from "../../../../config/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import styles from "./Friends.module.css";

// const Friends = ({ user }) => {
//   const [friends, setFriends] = useState([]);

//   useEffect(() => {
//     const fetchPharmacyOwners = async () => {
//       try {
//         const ownersRef = collection(mobileDb, "pharmacyOwners");
//         const snapshot = await getDocs(ownersRef);
//         const owners = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setFriends(owners);
//       } catch (error) {
//         console.error("Error fetching pharmacy owners:", error);
//       }
//     };

//     fetchPharmacyOwners();
//   }, []);

//   return (
//     <div>
//       {friends.map((friend) => (
//         <div key={friend.id} className={styles.friend}>
//           <div className={styles.friendImage}>
//             <img src="/image.png" alt="Friend" className={styles.image} />
//           </div>
//           <div className={styles.friendInfo}>
//             <h4 className={styles.friendName}>
//               {friend.firstName} {friend.lastName}
//             </h4>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Friends;

// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { mobileDb } from "../../../../config/firebase";
// import styles from "./Friends.module.css";

// const Friends = ({ selectChat }) => {
//   const [friends, setFriends] = useState([]);

//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const friendsRef = collection(mobileDb, "pharmacyOwners");
//         const snapshot = await getDocs(friendsRef);
//         const friendsList = snapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setFriends(friendsList);
//       } catch (error) {
//         console.error("Error fetching friends:", error);
//       }
//     };

//     fetchFriends();
//   }, []);

//   return (
//     <div>
//       {friends.map((friend) => (
//         <div
//           key={friend.id}
//           className={styles.friend}
//           onClick={() => selectChat(friend.id)}
//         >
//           <div className={styles.friendImage}>
//             <img src="/image.png" alt="Friend" className={styles.image} />
//           </div>
//           <div className={styles.friendInfo}>
//             <h4 className={styles.friendName}>
//               {friend.firstName} {friend.lastName}
//             </h4>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Friends;
