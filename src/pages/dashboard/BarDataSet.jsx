import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import fetchOrdersData from "./orders";
import { useState, useEffect } from "react";

const chartSetting = {
  yAxis: [
    {
      label: "No of Orders",
    },
  ],
  width: 800,
  height: 400,
  sx: {
    [`.${axisClasses.left} .${axisClasses.label}`]: {
      transform: "translate(-20px, 0)",
    },
  },
};

function BarDataSet() {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const getData = async () => {
      const data = await fetchOrdersData();
      setDataset(data);
    };

    getData();
  }, []);

  // Define valueFormatter (if needed, for formatting values)
  const valueFormatter = (value) => value;

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "month" }]}
      series={[
        { dataKey: "totalOrders", label: "Total Orders", valueFormatter },
        { dataKey: "canceled", label: "Canceled", valueFormatter },
        { dataKey: "completed", label: "Completed", valueFormatter },
        { dataKey: "ongoing", label: "OnGoing", valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}

export default BarDataSet;
