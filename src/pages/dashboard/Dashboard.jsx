import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ShortCard from "../../components/ShortCard";
import classes from "./Dashboard.module.css";

import ORDERS from "../../Details/orders";
import BarDataSet from "./BarDataSet";
import { collection, getDocs, query, where } from "firebase/firestore";
import { mobileDb, db } from "../../firebase";

function Dashboard() {
  const navigate = useNavigate();
  const [sortedOrders, setSortedOrders] = useState([]);
  const [isReversed, setIsReversed] = useState(false);
  const [isUrgentSorted, setIsUrgentSorted] = useState(false);
  const [underReview, setUnderReview] = useState(0);
  const [urgentCount, SetUrgentCount] = useState(0);
  const [production, setProduction] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [onHoldOrders, setOnHoldOrders] = useState(0);

  const handleNewOrdersClick = () => {
    navigate("/orders?tab=pending");
  };

  useEffect(() => {
    const filteredOrders = [...ORDERS].filter(
      (order) => order.isApproved === false
    );

    const fetchUnderReviewOrders = async () => {
      try {
        const ordersCollection = collection(mobileDb, "orders");
        const underReviewOrdersQuery = query(
          ordersCollection,
          where("status", "==", "underReview")
        );
        const querySnapshot = await getDocs(underReviewOrdersQuery);
        setUnderReview(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching under review orders: ", error);
      }
    };
    const fetchUrgent = async () => {
      try {
        const ordersCollection = collection(mobileDb, "orders");
        const approvedOrdersQuery = query(
          ordersCollection,
          where("priority", "==", true)
        );
        const querySnapshot = await getDocs(approvedOrdersQuery);
        SetUrgentCount(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching approved orders", error);
      }
    };
    const fetchProductionOrders = async () => {
      try {
        const ordersCollection = collection(mobileDb, "orders");
        const productionQuery = query(
          ordersCollection,
          where("status", "==", "onProduction")
        );
        const querySnapshot = await getDocs(productionQuery);
        setProduction(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching production orders: ", error);
      }
    };
    const fetchCancelledOrders = async () => {
      try {
        const ordersCollection = collection(mobileDb, "orders");
        const cancelledOrdersQuery = query(
          ordersCollection,
          where("status", "==", "cancelled")
        );
        const querySnapshot = await getDocs(cancelledOrdersQuery);
        setCancelledOrders(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching cancelled orders: ", error);
      }
    };
    const fetchCompletedOrders = async () => {
      try {
        const ordersCollection = collection(mobileDb, "orders");

        const completedOrdersQuery = query(
          ordersCollection,
          where("status", "==", "completed")
        );
        const querySnapshot = await getDocs(completedOrdersQuery);
        setCompletedOrders(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching completed orders: ", error);
      }
    };
    const fetchOnHoldOrders = async () => {
      try {
        const ordersCollection = collection(mobileDb, "orders");
        const productionQuery = query(
          ordersCollection,
          where("status", "==", "onHold")
        );
        const querySnapshot = await getDocs(productionQuery);
        setOnHoldOrders(querySnapshot.size);
      } catch (error) {
        console.error("Error fetching production orders: ", error);
      }
    };

    let sorted = filteredOrders;

    if (!isUrgentSorted) {
      sorted = filteredOrders.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return isReversed ? dateA - dateB : dateB - dateA;
      });
    }

    if (isUrgentSorted) {
      sorted = filteredOrders.sort((a, b) => {
        return isReversed ? a.isUrgent - b.isUrgent : b.isUrgent - a.isUrgent;
      });
    }

    setSortedOrders(sorted);
    fetchUnderReviewOrders();
    fetchUrgent();
    fetchProductionOrders();
    fetchCancelledOrders();
    fetchCompletedOrders();
    fetchOnHoldOrders();
  }, [isReversed, isUrgentSorted]);

  const toggleDateSortOrder = () => {
    setIsReversed(!isReversed);
    setIsUrgentSorted(false);
  };

  const toggleUrgencySortOrder = () => {
    setIsReversed(!isReversed);
    setIsUrgentSorted(true);
  };

  return (
    <>
      <h2>Manager Dashboard</h2>
      <div className={classes.card}>
        <div className={classes.cardlist}>
          <ShortCard title="New Orders" count={underReview} color="#4CAF50" />{" "}
          <ShortCard
            title="Urgent Orders"
            count={urgentCount}
            color="#FF5722"
          />
          <ShortCard title="On Going" count={production} color="#2196F3" />{" "}
          <ShortCard title="On Hold" count={onHoldOrders} color="#FFC107" />
        </div>
        <div className={classes.cardlist}>
          <ShortCard title="Total Sale" count={0} color="#673AB7" />{" "}
          <ShortCard title="Pending Payments" count={0} color="#F44336" />
          <ShortCard
            title="Canceled"
            count={cancelledOrders}
            color="#9E9E9E"
          />{" "}
          <ShortCard
            title="Completed"
            count={completedOrders}
            color="#8BC34A"
          />
        </div>
      </div>
      <div className={classes.container}>
        <div className={classes.flexWrap}>
          {/* Left Panel */}
          <div className={classes.leftPanel}>
            <div className={classes.panelContent}>
              <BarDataSet />
            </div>
          </div>

          {/* Right Panel */}
          <div className={classes.rightPanel}>
            <div className={classes.panelContent}>
              <div className={classes.toppart}>
                <h2> Recent Messages</h2>
                <Link> View All </Link>
              </div>
              <div className={classes.messageContent}>
                <ol className={classes.messages}>
                  <li>
                    <div className={classes.convercation}>
                      <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQGHZntET8i1cQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1690168538659?e=1739404800&v=beta&t=AVNHl3Nit4ktYE1cVkvxeUf6Tl3b4gG4a3kDWxWrWUI"
                        alt=""
                      />
                    </div>
                    <div className={classes.messagespreview}>
                      <div className={classes.messagespreviewLink}>
                        <Link>Roshan Phamacy</Link>
                        <time> 2 Days ago</time>
                      </div>
                      <div className={classes.messagespreviewtext}>
                        {" "}
                        how are you{" "}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={classes.convercation}>
                      <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQGHZntET8i1cQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1690168538659?e=1739404800&v=beta&t=AVNHl3Nit4ktYE1cVkvxeUf6Tl3b4gG4a3kDWxWrWUI"
                        alt=""
                      />
                    </div>
                    <div className={classes.messagespreview}>
                      <div className={classes.messagespreviewLink}>
                        <Link>Roshan Phamacy</Link>
                        <time> 2 Days ago</time>
                      </div>
                      <div className={classes.messagespreviewtext}>
                        {" "}
                        how are you{" "}
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className={classes.convercation}>
                      <img
                        src="https://media.licdn.com/dms/image/v2/D5603AQGHZntET8i1cQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1690168538659?e=1739404800&v=beta&t=AVNHl3Nit4ktYE1cVkvxeUf6Tl3b4gG4a3kDWxWrWUI"
                        alt=""
                      />
                    </div>
                    <div className={classes.messagespreview}>
                      <div className={classes.messagespreviewLink}>
                        <Link>Roshan Phamacy</Link>
                        <time> 2 Days ago</time>
                      </div>
                      <div className={classes.messagespreviewtext}>
                        {" "}
                        how are you{" "}
                      </div>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className={classes.tablecontainer}>
        <div className={classes.buttonContainer}>
          <button onClick={toggleDateSortOrder} className={classes.sortButton}>
            {isReversed ? "Sort Newest to Oldest" : "Sort Oldest to Newest"}
          </button>
          <button
            onClick={toggleUrgencySortOrder}
            className={classes.sortButton}
          >
            {isReversed
              ? "Sort Urgent to Non-Urgent"
              : "Sort Non-Urgent to Urgent"}
          </button>
        </div>
        <table className={classes.chart}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Pharmacy Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map((order) => {
              return (
                <tr key={order.orderId}>
                  <td>
                    <Link to={`/orders/${order.orderId}`}>{order.orderId}</Link>
                  </td>
                  <td>
                    <Link to={`/customers/${order.customerId}`}>
                      {order.customerId}
                    </Link>
                  </td>
                  <td>{order.quantity}</td>
                  <td>
                    <Link to={`/customers/${order.customerId}`}>
                      {order.pharmacyName}
                    </Link>
                  </td>
                  <td>{order.date}</td>
                  <td>{order.time}</td>
                  <td>
                    {order.isUrgent ? (
                      <div
                        className={classes.tablespan || ""}
                        style={{ color: "red", fontWeight: "bold" }}
                      >
                        URGENT
                      </div>
                    ) : (
                      <div
                        className={classes.tablespan || ""}
                        style={{ color: "green", fontWeight: "bold" }}
                      >
                        Not urgent
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
    </>
  );
}
export default Dashboard;
