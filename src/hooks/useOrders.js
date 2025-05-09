import { useState, useEffect } from "react";
import { getAllOrders, getAllPharmacyOwners } from "../firebaseService";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, ownersData] = await Promise.all([
          getAllOrders(),
          getAllPharmacyOwners(),
        ]);
        setOrders(ordersData);
        setOwners(ownersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { orders, owners, loading };
};
