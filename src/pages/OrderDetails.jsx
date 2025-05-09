import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { mobileDb } from "../firebase";
import classes from "./OrderDetails.module.css";

function OrderDetails() {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [pharmacyOwner, setPharmacyOwner] = useState(null);
  const [designDetails, setDesignDetails] = useState(null);
  const [newState, setNewState] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [totalPrice, setTotalPrice] = useState(null);
  const [isApproved , setIsApproved] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderDoc = doc(mobileDb, "orders", orderId);
        const orderSnapshot = await getDoc(orderDoc);

        if (orderSnapshot.exists()) {
          const orderData = orderSnapshot.data();
          setOrderDetails(orderData);

          if (orderData.userId) {
            const ownerDoc = doc(mobileDb, "pharmacyOwners", orderData.userId);
            const ownerSnapshot = await getDoc(ownerDoc);
            if (ownerSnapshot.exists()) {
              setPharmacyOwner(ownerSnapshot.data());
            }
          }

          if (orderData.design) {
            const designQuery = query(
              collection(mobileDb, "Products"),
              where("id", "==", orderData.design)
            );
            const designSnapshot = await getDocs(designQuery);
            if (!designSnapshot.empty) {
              setDesignDetails(designSnapshot.docs[0].data());
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleApprove = async () => {
    try {
      const orderDoc = doc(mobileDb, "orders", orderId);
      await updateDoc(orderDoc, { status: "onProduction" });
      setOrderDetails((prev) => ({ ...prev, status: "onProduction" }));
      alert("Order approved and set to production.");
    } catch (error) {
      console.error("Error approving order:", error);
    }
  };

  const handleReject = async () => {
    try {
      const orderDoc = doc(mobileDb, "orders", orderId);
      await updateDoc(orderDoc, { status: "cancelled" });
      setOrderDetails((prev) => ({ ...prev, status: "cancelled" }));
      alert("Order rejected.");
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  const handleUnitPriceSubmit = async () => {
    if (!unitPrice) return alert("Please enter a unit price.");
    try {
      const orderDoc = doc(mobileDb, "orders", orderId);
      const unitPriceValue = parseFloat(unitPrice);
      const total = unitPriceValue * orderDetails.quantity;

      await updateDoc(orderDoc, { unitPrice: unitPriceValue });
      setIsApproved(true);;
      alert("Unit price updated successfully!");
    } catch (error) {
      console.error("Error updating unit price:", error);
    }
  };

  const handleStateChange = async () => {
    if (!newState) return alert("Please select a status.");
    const confirm = window.confirm(
      `Are you sure you want to set status to ${newState}?`
    );
    if (!confirm) return;

    try {
      const orderDoc = doc(mobileDb, "orders", orderId);
      await updateDoc(orderDoc, { status: newState });
      setOrderDetails((prev) => ({ ...prev, status: newState }));
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className={classes.container}>
      <h2>Order Details</h2>
      <div className={classes.detailsSection}>
        <h3>Order Information</h3>
        {orderDetails.priority && (
          <div className={classes.urgentBadge}>Urgent</div>
        )}
        <p>
          <strong>Order ID:</strong> {orderId}
        </p>
        <p>
          <strong>Design:</strong> {orderDetails.design}
        </p>
        <p>
          <strong>Size:</strong> {orderDetails.size}
        </p>
        <p>
          <strong>Quantity:</strong> {orderDetails.quantity}
        </p>
        <p>
          <strong>Status:</strong> {orderDetails.status}
        </p>
        {isApproved && (
          <p>
            <strong>Total Price:</strong> Rs.{unitPrice}
          </p>
        )}
        

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(orderDetails.createdAt.seconds * 1000).toLocaleString()}
        </p>
      </div>

      {pharmacyOwner && (
        <div className={classes.detailsSection}>
          <h3>Pharmacy Owner Information</h3>
          <p>
            <strong>Pharmacy Name:</strong> {pharmacyOwner.pharmacyName}
          </p>
          <p>
            <strong>Owner Name:</strong>{" "}
            {`${pharmacyOwner.firstName || ""} ${pharmacyOwner.lastName || ""}`}
          </p>
          <p>
            <strong>Contact:</strong> {pharmacyOwner.contact || "N/A"}
          </p>
        </div>
      )}

      {designDetails && (
        <div className={classes.detailsSection}>
          <h3>Design Details</h3>
          <p>
            <strong>Design Name:</strong> {designDetails.name}
          </p>
          {designDetails.imageUrl && (
            <img
              src={designDetails.imageUrl}
              alt={designDetails.name}
              className={classes.designImage}
            />
          )}
        </div>
      )}

      <div className={classes.actionsSection}>
        <h3>Actions</h3>

        {/* Initially, show Approve & Reject buttons */}
        {orderDetails.status === "underReview" ? (
          <>
            <button onClick={handleApprove} className={classes.approveButton}>
              Approve
            </button>
            <button onClick={handleReject} className={classes.rejectButton}>
              Reject
            </button>
          </>):null}
          {orderDetails.status === "onProduction" && (
            <div className={classes.unitPriceInput}>
              <input
              type="number"
              placeholder="Enter unit price"
              value={unitPrice}
              onChange={(e)=> setUnitPrice(e.target.value)}
              />
              <button onClick={handleUnitPriceSubmit}>Submit</button>
        
            </div>
          )}
          {/*} After approval/rejection, show dropdown for status change*/}
          {(orderDetails.status === "onProduction" || orderDetails.status === "delivered") && (
    <div className={classes.statusChangeSection}>
      <label htmlFor="orderState">Change Order State:</label>
      <select
        id="orderState"
        value={newState}
        onChange={(e) => setNewState(e.target.value)}
      >
        <option value="">Select State</option>
        {orderDetails.status === "onProduction" && (
          <option value="delivered">Delivered</option>
        )}
        {orderDetails.status === "delivered" && (
          <option value="completed">Completed</option>
        )}
        
      </select>
      <button onClick={handleStateChange} disabled={!newState}>
        Update State
      </button>
    </div>
  )}
  <h3>
        {orderDetails.status === "onProduction"
          ? "Order was approved"
          : orderDetails.status === "cancelled"
          ? "Order was rejected ❌"
          : orderDetails.status === "delivered"
          ? "Order is delivered 📦"
          : orderDetails.status === "completed"
          ? "Order is completed ✅"
        :"Order is underReview"}
      </h3>
      </div>
    </div>
  );
}

export default OrderDetails;
