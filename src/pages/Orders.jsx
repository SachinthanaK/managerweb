import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import classes from "./Orders.module.css";
import OrderTable from "./OrderTable";

function Orders() {
  const [activeTab, setActiveTab] = useState("allOrders");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  function handleClick(tabName) {
    setActiveTab(tabName);
  }
  const tabs = [
    { name: "All Orders", value: "allOrders" },
    { name: "Urgent", value: "urgent" },
    { name: "Pending", value: "pending" },
    { name: "Approved", value: "approved" },
    { name: "Canceled", value: "cancelled" },
    { name: "On Hold", value: "onHold" },
    { name: "Complete", value: "completed" },
  ];

  return (
    <div>
      <div className={classes.buttonContainer}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`${classes.Button} ${
              activeTab === tab ? classes.active : ""
            }`}
            onClick={() => handleClick(tab.value)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className={classes.tablecontainer}>
        <OrderTable onActiveTab={activeTab} />
      </div>
    </div>
  );
}

export default Orders;
