import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, getDocs, where } from "firebase/firestore";
import { mobileDb } from "../../../config/firebase.js";

const ChatList = ({ onSelectChat }) => {
  const [chats, setChats] = useState([]);
  const [pharmacyOwnerIds, setPharmacyOwnerIds] = useState(new Set()); 

  useEffect(() => {
    
    const fetchPharmacyOwners = async () => {
      try {
        const ownersRef = collection(mobileDb, "pharmacyOwners");
        const snapshot = await getDocs(ownersRef);
        const ownerIds = new Set(snapshot.docs.map((doc) => doc.id)); 
        setPharmacyOwnerIds(ownerIds);
      } catch (error) {
        console.error("Error fetching pharmacy owners:", error);
      }
    };

    fetchPharmacyOwners();
  }, []);

  useEffect(() => {
    if (pharmacyOwnerIds.size === 0) return;

    const q = query(collection(mobileDb, "chats"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filteredChats = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((chat) => pharmacyOwnerIds.has(chat.userId)); 

      setChats(filteredChats);
    });

    return () => unsubscribe();
  }, [pharmacyOwnerIds]); 

  return (
    <div>
      <h2>Active Chats</h2>
      <ul>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <li key={chat.id} onClick={() => onSelectChat(chat.id)}>
              Chat with {chat.userId}
            </li>
          ))
        ) : (
          <p>No chats found for pharmacy owners.</p>
        )}
      </ul>
    </div>
  );
};

export default ChatList;
