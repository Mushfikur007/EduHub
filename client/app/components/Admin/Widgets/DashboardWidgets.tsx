import React, { FC, useEffect, useState } from "react";
import UserAnalytics from "../Analytics/UserAnalytics";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";
import { Box, CircularProgress } from "@mui/material";
import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import AllInvoices from "../Order/AllInvoices";
import {
  useGetOrdersAnalyticsQuery,
  useGetUsersAnalyticsQuery,
} from "@/redux/features/analytics/analyticsApi";
import Loader from "../../Loader/Loader";

type Props = {
  open?: boolean;
  value?: number;
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value || 0}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [ordersComparePercentage, setOrdersComparePercentage] = useState<any>({
    currentMonth: 0,
    previousMonth: 0,
    percentChange: 0
  });
  const [userComparePercentage, setuserComparePercentage] = useState<any>({
    currentMonth: 0,
    previousMonth: 0,
    percentChange: 0
  });

  const { data: userData, isLoading: userLoading, error: userError } = useGetUsersAnalyticsQuery({});
  const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetOrdersAnalyticsQuery({});

  useEffect(() => {
    if (userLoading || ordersLoading) {
      return;
    }

    try {
      if (userData?.user && ordersData?.orders) {
        const usersLastTwoMonths = userData.user.last12Months.slice(-2);
        const ordersLastTwoMonths = ordersData.orders.last12Months.slice(-2);

        if (
          usersLastTwoMonths.length === 2 &&
          ordersLastTwoMonths.length === 2
        ) {
          const usersCurrentMonth = usersLastTwoMonths[1].count || 0;
          const usersPreviousMonth = usersLastTwoMonths[0].count || 0;
          const ordersCurrentMonth = ordersLastTwoMonths[1].count || 0;
          const ordersPreviousMonth = ordersLastTwoMonths[0].count || 0;

          const usersPercentChange = usersPreviousMonth !== 0 ?
            ((usersCurrentMonth - usersPreviousMonth) / usersPreviousMonth) *
            100 : 100;

          const ordersPercentChange = ordersPreviousMonth !== 0 ?
            ((ordersCurrentMonth - ordersPreviousMonth) / ordersPreviousMonth) *
            100 : 100;

          setuserComparePercentage({
            currentMonth: usersCurrentMonth,
            previousMonth: usersPreviousMonth,
            percentChange: usersPercentChange,
          });

          setOrdersComparePercentage({
            currentMonth: ordersCurrentMonth,
            previousMonth: ordersPreviousMonth,
            percentChange: ordersPercentChange,
          });
        }
      }
    } catch (error) {
      console.error("Error processing analytics data:", error);
    }
  }, [userLoading, ordersLoading, userData, ordersData]);

  if (userLoading || ordersLoading) {
    return <Loader />;
  }

  if (userError || ordersError) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-center text-red-500">
          Error loading analytics data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-[30px] min-h-screen">
      <div className="grid grid-cols-[75%,25%]">
        <div className="p-8 ">
          <UserAnalytics isDashboard={true} />
        </div>

        <div className="pt-[80px] pr-8">
          <div className="w-full dark:bg-[#111C43] rounded-sm shadow">
            <div className="flex items-center p-5 justify-between">
              <div className="">
                <BiBorderLeft className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                  {ordersComparePercentage?.currentMonth || 0}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
                  Sales Obtained
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel value={
                  ordersComparePercentage?.percentChange > 0 
                  ? 100 
                  : 0
                } open={open} />
                <h5 className="text-center pt-4">
                  {ordersComparePercentage?.percentChange > 0 
                  ? "+" + ordersComparePercentage?.percentChange.toFixed(2)
                  : ordersComparePercentage?.percentChange.toFixed(2)} %
                </h5>
              </div>
            </div>
          </div>

          <div className="w-full dark:bg-[#111C43] rounded-sm shadow my-8">
            <div className="flex items-center p-5 justify-between">
              <div className="">
                <PiUsersFourLight className="dark:text-[#45CBA0] text-[#000] text-[30px]" />
                <h5 className="pt-2 font-Poppins dark:text-[#fff] text-black text-[20px]">
                  {userComparePercentage?.currentMonth || 0}
                </h5>
                <h5 className="py-2 font-Poppins dark:text-[#45CBA0] text-black text-[20px] font-[400]">
                  New Users
                </h5>
              </div>
              <div>
                <CircularProgressWithLabel value={
                  userComparePercentage?.percentChange > 0 
                  ? 100 
                  : 0
                } open={open} />
                <h5 className="text-center pt-4">
                  {userComparePercentage?.percentChange > 0
                    ? "+" + userComparePercentage?.percentChange.toFixed(2) 
                    : userComparePercentage?.percentChange.toFixed(2)} %
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[65%,35%] mt-[-20px]">
        <div className="dark:bg-[#111c43] w-[94%] mt-[30px] h-[40vh] shadow-sm m-auto">
          <OrdersAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          <h5 className="dark:text-[#fff] text-black text-[20px] font-[400] font-Poppins pb-3">
            Recent Transactions
          </h5>
          <AllInvoices isDashboard={true} />
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgets;
