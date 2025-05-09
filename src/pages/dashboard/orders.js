import { collection, getDocs } from "firebase/firestore";
import { mobileDb } from "../../firebase"; // Adjust the import path

const fetchOrdersData = async () => {
  try {
    const ordersCollection = collection(mobileDb, "orders");
    const querySnapshot = await getDocs(ordersCollection);

    // Initialize month-wise statistics
    const monthlyStats = {};

    // Process each document
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const createdAt = new Date(data.createdAt);

      const month = createdAt.toLocaleString("en-US", { month: "short" });

      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          month,
          totalOrders: 0,
          canceled: 0,
          completed: 0,
          ongoing: 0,
          onHold: 0,
        };
      }

      monthlyStats[month].totalOrders++;

      // Categorize by status
      switch (data.status) {
        case "canceled":
          monthlyStats[month].canceled++;
          break;
        case "completed":
          monthlyStats[month].completed++;
          break;
        case "onDelivery":
          monthlyStats[month].ongoing++;
          break;
        case "onHold":
          monthlyStats[month].onHold++;
          break;
        default:
          break;
      }
    });

    // Convert object to array
    const dataset = Object.values(monthlyStats);

    console.log(dataset);
    return dataset;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Call the function
export default fetchOrdersData;
