import { collection, getDocs, query, where } from "firebase/firestore";
import { mobileDb } from "./firebase"; // Your Firebase setup
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// Fetch all orders
export const getAllOrders = async () => {
  const ordersCollection = collection(mobileDb, "orders");
  const snapshot = await getDocs(ordersCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch all pharmacy owners
export const getAllPharmacyOwners = async () => {
  const ownersCollection = collection(mobileDb, "pharmacyOwners");
  const snapshot = await getDocs(ownersCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch specific pharmacy owner by userId
export const getPharmacyOwnerById = async (userId) => {
  const ownersCollection = collection(mobileDb, "pharmacyOwners");
  const q = query(ownersCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0
    ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
    : null;
};
// Update pharmacy owner details
export const updatePharmacyOwner = async (id, data) => {
  const docRef = doc(mobileDb, "pharmacyOwners", id);
  await updateDoc(docRef, data);
};

// Delete pharmacy owner
export const deletePharmacyOwner = async (id) => {
  const docRef = doc(mobileDb, "pharmacyOwners", id);
  await deleteDoc(docRef);
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const orderRef = doc(mobileDb, "orders", orderId);
  await updateDoc(orderRef, { status: newStatus });
};

// Fetch specific order by ID
export const getOrderById = async (orderId) => {
  const ordersCollection = collection(mobileDb, "orders");
  const q = query(ordersCollection, where("orderId", "==", orderId));
  const snapshot = await getDocs(q);
  return snapshot.docs.length > 0
    ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
    : null;
};
