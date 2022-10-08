import React from "react";
import Header from "../../../partials/Header";
import Sidebar from "../../../partials/Sidebar";

function Frame({ sidebarOpen, setSidebarOpen, children, title }) {
    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className='relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} title={title} />
                {children}
            </div>
        </div>
    );
}

export default Frame;
