import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { collection, getDocs } from "firebase/firestore";
import { mobileDb } from "../firebase";
import { useNavigate } from "react-router-dom";

const getStateColor = (state) => {
  switch (state) {
    case "onDesigning":
      return "orange";
    case "completed":
      return "green";
    case "underReview":
      return "red";
    case "onProduction":
      return "purple";
    case "onDelivery":
      return "blue";
    default:
      return "black";
  }
};

const fetchPharmacyOwnerDetails = async () => {
  const snapshot = await getDocs(collection(mobileDb, "pharmacyOwners"));
  const owners = {};
  snapshot.forEach((doc) => {
    owners[doc.id] = doc.data();
  });
  return owners;
};

export default function OrderTable({ onActiveTab }) {
  const [orderData, setOrderData] = useState([]);
  const [pharmacyOwners, setPharmacyOwners] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const [querySnapshot, owners] = await Promise.all([
          getDocs(collection(mobileDb, "orders")),
          fetchPharmacyOwnerDetails(),
        ]);
        setPharmacyOwners(owners);

        console.log("Fetched Pharmacy Owners:", owners); // Debugging

        const orders = [];
        querySnapshot.forEach((doc, index) => {
          const data = doc.data();
          const owner = owners[data.userId] || {}; // Get matching owner

          console.log("User ID:", data.userId, "Owner Data:", owner); // Debugging

          orders.push({
            id: doc.id,
            orderId: doc.id,
            pharmacyName: owner.pharmacyName || "User not found",
            review: data.status === "underReview" ? "Pending" : "Reviewed",
            urgency: data.priority ? "Urgent" : "Not Urgent",
            design: data.design || "N/A",
            size: data.size || "N/A",
            state: data.status || "Unknown",
            createdAt: data.createdAt
              ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() +
                " " +
                new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            quantity: data.quantity || 0,
            rowNumber: index + 1, // Sequential numbering
          });
        });
        setOrderData(orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrderData();
  }, []);

  const rows = orderData.filter((order) => {
    switch (onActiveTab) {
      case "allOrders":
        return true;
      case "urgent":
        return order.urgency === "Urgent";
      case "pending":
        return order.review === "Pending";
      case "approved":
        return order.state === "approved";
      case "cancelled":
        return order.state === "cancelled";
      case "onHold":
        return order.state === "onHold";
      case "completed":
        return order.state === "completed";
      default:
        return true;
    }
  });

  const handleRowClick = (params) => {
    navigate(`/orders/${params.row.orderId}`);
  };

  const columns = [
    { field: "rowNumber", headerName: "No.", width: 80 },
    { field: "orderId", headerName: "Order ID", width: 150 },
    { field: "pharmacyName", headerName: "Pharmacy Name", width: 250 },
    {
      field: "review",
      headerName: "Review",
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value === "Reviewed" ? "green" : "red" }}>
          {params.value}
        </span>
      ),
    },
    {
      field: "urgency",
      headerName: "Urgency",
      width: 120,
      renderCell: (params) => (
        <span style={{ color: params.value === "Urgent" ? "red" : "blue" }}>
          {params.value}
        </span>
      ),
    },
    { field: "design", headerName: "Design", width: 150 },
    { field: "size", headerName: "Size", width: 100 },
    {
      field: "state",
      headerName: "State",
      width: 150,
      renderCell: (params) => (
        <span style={{ color: getStateColor(params.value) }}>
          {params.value}
        </span>
      ),
    },
    { field: "createdAt", headerName: "Created At", width: 250 },
    { field: "quantity", headerName: "Quantity", width: 100 },
  ];

  return (
    <Paper sx={{ height: 700, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} onRowClick={handleRowClick} />
    </Paper>
  );
}

OrderTable.propTypes = {
  onActiveTab: PropTypes.string.isRequired,
};
