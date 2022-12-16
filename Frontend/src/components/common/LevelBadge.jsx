import { Badge } from "flowbite-react";
import React from "react";

function LevelBadge({ level, label, className = "", style }) {
    return (
        <div className={className} style={style}>
            <Badge
                color={level === "Dễ" ? "success" : level === "Trung bình" ? "warning" : "failure"}
            >
                <div className='flex items-center justify-between w-full'>
                    <div>{label}</div>
                </div>
            </Badge>
        </div>
    );
}

export default LevelBadge;
