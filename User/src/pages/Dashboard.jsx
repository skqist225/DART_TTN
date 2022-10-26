import React, { useEffect, useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { useDispatch, useSelector } from "react-redux";
import { UsersPage, SubjectsPage } from ".";
import { useLocation, useNavigate } from "react-router-dom";
import { authState } from "../features/authSlice";
// import SimpleStatNumber from "../components/utils/SimpleStatNumber";
// import StackedBarChart from "../partials/dashboard/DashboardCard09";

import LineChart from "../partials/dashboard/LineChart";
import LineChartDashboard from "../partials/dashboard/LineChartDashboard";
import CircleChart from "../partials/dashboard/CircleChart";
import { userState } from "../features/userSlice";

function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { pathname } = useLocation();
    const { user } = useSelector(userState);
    const {
        loginAction: { loading },
    } = useSelector(authState);

    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main>
                    <div className='px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto'>
                        {pathname === "/users" && <UsersPage />}

                        {pathname === "/" && (
                            <>
                                {/* <WelcomeBanner /> */}

                                <div>
                                    <div className='flex items-center justify-between w-full'>
                                        {/* <SimpleStatNumber
                                            label='Total Sales In Month'
                                            type='All'
                                            backgroundColor={`bg-violet-500`}
                                            number={totalSales}
                                        />
                                        <SimpleStatNumber
                                            label='Total Bookings'
                                            type='Approved'
                                            backgroundColor={`bg-rose-500`}
                                            number={totalBookings}
                                        />
                                        <SimpleStatNumber
                                            label='Total Houses/Rooms'
                                            type='Pending'
                                            backgroundColor={`bg-amber-500`}
                                            number={totalRooms}
                                        />
                                        <SimpleStatNumber
                                            label='Total Users'
                                            type='Cancelled'
                                            backgroundColor={`bg-green-500`}
                                            number={totalUsers}
                                        /> */}
                                    </div>
                                    {/* <DashboardCard01 /> */}
                                    {/* <DashboardCard02 /> */}
                                    {/* <DashboardCard03 /> */}

                                    <div className='my-10'>
                                        {/* {!getCreatedRoomByMonthAndYearActionLoading && (
                                            <LineChartDashboard
                                                data={[lcdataSet1, lcdataSet2]}
                                                label='Created Room By Month'
                                            />
                                        )} */}
                                    </div>
                                    <div>
                                        {/* <DashboardCard04 /> */}
                                        {/* <DashboardCard05 /> */}
                                        {/* {!countUserByRoleActionLoading && (
                                            <CircleChart
                                                data={[numberOfUsers, numberOfHost, numberOfAdmin]}
                                            />
                                        )} */}
                                        {/* <DashboardCard06 /> */}
                                        {/* <DashboardCard07 />
                                        <DashboardCard08 /> */}
                                        {/* <StackedBarChart /> */}
                                        {/* <DashboardCard10 /> */}
                                        {/* <DashboardCard11 />
                                        <DashboardCard12 />
                                        <DashboardCard13 /> */}
                                    </div>
                                    {/* <div className='my-10'>
                                        {!fetchBookingsCountByMonthAndYearActionLoading && (
                                            <StackedBarChart
                                                data={[dataSet1, dataSet2, dataSet3]}
                                            />
                                        )}
                                    </div>
                                    <div className='my-10'>
                                        {!gbrLoading && (
                                            <LineChart
                                                data={[lcdataSet11, lcdataSet22]}
                                                label='Sales Over Time (all bookings)'
                                            />
                                        )}
                                    </div> */}
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
