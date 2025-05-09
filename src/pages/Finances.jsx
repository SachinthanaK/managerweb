import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { mobileDb, db } from "../../../config/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import styles from "./Finance.module.css";

const Finances = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentsData, setPaymentsData] = useState([]);
  const [newPayment, setNewPayment] = useState({
    paymentId: "",
    orderId: "",
    qty: "",
    date: "",
    time: "",
    totalCost: "",
    amount: "",
    balance: "",
    paymentMethod: "",
    remarks: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNewPayment({
      paymentId: "",
      orderId: "",
      qty: "",
      date: "",
      time: "",
      totalCost: "",
      amount: "",
      balance: "",
      paymentMethod: "",
      remarks: "",
    });
  };

  useEffect(() => {
    const fetchOrdersAndPayments = async () => {
      try {
        const ordersSnapshot = await getDocs(collection(mobileDb, "orders"));
        const paymentsSnapshot = await getDocs(collection(db, "payments"));

        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const payments = paymentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrdersData(orders);
        setPaymentsData(payments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrdersAndPayments();
  }, []);

  const getRemainingBalance = (orderId, unitPrice) => {
    const previousPayments = paymentsData.filter(
      (payment) => payment.orderId === orderId
    );
    const totalPaid = previousPayments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );
    return unitPrice - totalPaid;
  };

  const handleOrderChange = (e) => {
    const selectedOrderId = e.target.value;
    const order = ordersData.find((order) => order.id === selectedOrderId);
    setSelectedOrder(order);

    if (order) {
      const remainingBalance = getRemainingBalance(order.id, order.unitPrice);
      setNewPayment((prev) => ({
        ...prev,
        orderId: order.id,
        qty: order.quantity,
        totalCost: order.unitPrice,
        balance: remainingBalance,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === "amount" ? Number(value) : value;
    setNewPayment((prev) => ({
      ...prev,
      [name]: parsedValue,
      balance:
        name === "amount"
          ? prev.totalCost - Number(value)
          : prev.balance,
    }));
  };

  const generatePaymentId = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const randomNumber = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${day}${month}${year}${randomNumber}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentId = generatePaymentId();
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();

      const paymentData = {
        paymentId,
        orderId: newPayment.orderId,
        qty: newPayment.qty,
        date,
        time,
        totalCost: newPayment.totalCost,
        amount: newPayment.amount,
        balance: newPayment.balance,
        paymentMethod: newPayment.paymentMethod,
        remarks: newPayment.remarks,
      };

      await addDoc(collection(db, "payments"), paymentData);

      const paymentsSnapshot = await getDocs(collection(db, "payments"));
      setPaymentsData(
        paymentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      closeModal();
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.addPaymentButton} onClick={openModal}>
        Add Payment
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Add Payment</h2>
              <AiOutlineClose
                className={styles.closeButton}
                onClick={closeModal}
              />
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Order ID</label>
                <select
                  name="orderId"
                  onChange={handleOrderChange}
                  className={styles.inputField}
                  required
                >
                  <option value="">Select Order ID</option>
                  {ordersData
                    .filter(
                      (order) =>
                        getRemainingBalance(order.id, order.unitPrice) > 0
                    )
                    .map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id}
                      </option>
                    ))}
                </select>
              </div>

              {selectedOrder && (
                <div className={styles.detailsGrid}>
                  <div className={styles.column}>
                    <label>Design</label>
                    <input type="text" value={selectedOrder.design} disabled />
                    <label>Priority</label>
                    <input
                      type="text"
                      value={selectedOrder.priority}
                      disabled
                    />
                    <label>Quantity</label>
                    <input
                      type="text"
                      value={selectedOrder.quantity}
                      disabled
                    />
                    <label>Status</label>
                    <input type="text" value={selectedOrder.status} disabled />
                  </div>
                  <div className={styles.column}>
                    <label>Address</label>
                    <input
                      type="text"
                      value={selectedOrder.address}
                      disabled
                    />
                    <label>Contact Number</label>
                    <input
                      type="text"
                      value={selectedOrder.contactNumber}
                      disabled
                    />
                  </div>
                  <div className={styles.column}>
                    <label>Total Cost</label>
                    <input
                      type="text"
                      value={selectedOrder.unitPrice}
                      disabled
                    />
                    <label>Amount</label>
                    <input
                      type="number"
                      name="amount"
                      value={newPayment.amount}
                      onChange={handleChange}
                      required
                    />
                    <label>Balance</label>
                    <input type="text" value={newPayment.balance} disabled />
                    <label>Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={newPayment.paymentMethod}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Payment Method</option>
                      <option value="Bank Deposit">Bank Deposit</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Ezcash">Ezcash</option>
                      <option value="Cash">Cash</option>
                    </select>
                    <label>Remarks</label>
                    <textarea
                      name="remarks"
                      value={newPayment.remarks}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={closeModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className={styles.paymentTable}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Order ID</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Time</th>
            <th>Total Cost</th>
            <th>Amount</th>
            <th>Balance</th>
            <th>Payment Method</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {paymentsData.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.paymentId}</td>
              <td>{payment.orderId}</td>
              <td>{payment.qty}</td>
              <td>{payment.date}</td>
              <td>{payment.time}</td>
              <td>{payment.totalCost}</td>
              <td>{payment.amount}</td>
              <td>{payment.balance}</td>
              <td>{payment.paymentMethod}</td>
              <td>{payment.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Finances;
