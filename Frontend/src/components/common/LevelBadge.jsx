import { Badge } from "flowbite-react";
import React from "react";

function LevelBadge({ level, label }) {
    return (
        <Badge color={level === "Dễ" ? "success" : level === "Trung bình" ? "warning" : "failure"}>
            <div className='flex items-center justify-between w-full'>
                <div>{label}</div>
            </div>
        </Badge>
    );
}

export default LevelBadge;
