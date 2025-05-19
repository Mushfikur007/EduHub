import { styles } from "@/app/styles/style";
import { useGetOrdersAnalyticsQuery } from "@/redux/features/analytics/analyticsApi";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loader from "../../Loader/Loader";

// const analyticsData = [
//   {
//     name: "Page A",
//     Count: 4000,
//   },
//   {
//     name: "Page B",
//     Count: 3000,
//   },
//   {
//     name: "Page C",
//     Count: 5000,
//   },
//   {
//     name: "Page D",
//     Count: 1000,
//   },
//   {
//     name: "Page E",
//     Count: 4000,
//   },
//   {
//     name: "Page F",
//     Count: 800,
//   },
//   {
//     name: "Page G",
//     Count: 200,
//   },
// ];

type Props = {
  isDashboard?: boolean;
};

export default function OrdersAnalytics({ isDashboard }: Props) {
  const { data, isLoading, error } = useGetOrdersAnalyticsQuery({});
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.orders) {
      const formattedData = data.orders.last12Months.map((item: any) => ({
        name: item.month,
        Count: item.count
      }));
      setAnalyticsData(formattedData);
    }
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-center text-red-500">
          Error loading orders analytics data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
      <div
        className={isDashboard ? "mt-[0px] pl-[40px] mb-2" : "mt-[50px]"}
      >
        <h1
          className={`${styles.title} ${
            isDashboard && "!text-[20px]"
          } px-5 !text-start`}
        >
          Orders Analytics
        </h1>
        {!isDashboard && (
          <p className={`${styles.label} px-5`}>
            Last 12 months analytics data{" "}
          </p>
        )}
      </div>
      <div
        className={`w-full ${
          !isDashboard ? "h-[90%]" : "h-full"
        } flex items-center justify-center`}
      >
        <ResponsiveContainer
          width={isDashboard ? "100%" : "90%"}
          height={isDashboard ? "100%" : "50%"}
        >
          <LineChart
            width={500}
            height={300}
            data={analyticsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {!isDashboard && <Legend />}
            <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
