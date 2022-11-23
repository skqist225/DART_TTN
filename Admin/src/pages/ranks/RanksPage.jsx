import React, { useState } from "react";
import { Frame } from "../../components";

function RanksPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <Frame
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            title={"BẢNG XẾP HẠNG"}
            children={<></>}
        />
    );
}

export default RanksPage;
