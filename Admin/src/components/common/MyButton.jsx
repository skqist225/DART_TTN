import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import DisableImage from "../../images/disable-icon.png";
import AddIcon from "@mui/icons-material/Add";
export const ButtonType = {
    add: "add",
    view: "view",
    delete: "delete",
    edit: "edit",
};

function MyButton({ type, label = "", disabled = false, onClick, className }) {
    let buttonClassName = "",
        buttonDisableClassName = "",
        Icon = null;
    switch (type) {
        case "add": {
            buttonClassName = "bg-indigo-600 hover:bg-indigo-600";
            Icon = (
                <AddIcon
                    style={{
                        width: "28px",
                        height: "28px",
                        filter: "brightness(0) invert(1)",
                    }}
                />
            );
            break;
        }
        case "delete": {
            buttonClassName = "bg-rose-500 hover:bg-rose-500";
            buttonDisableClassName = "bg-rose-200 hover:bg-rose-200";
            Icon = <DeleteIcon />;
            break;
        }
        case "disable": {
            buttonClassName = "bg-amber-500 hover:bg-amber-500";
            buttonDisableClassName = "bg-amber-200 hover:bg-amber-200";
            Icon = (
                <img
                    src={DisableImage}
                    style={{
                        maxWidth: "24px",
                        filter: "invert(100%) sepia(64%) saturate(371%) hue-rotate(284deg) brightness(108%) contrast(104%)",
                    }}
                />
            );
            break;
        }
        case "enable": {
            buttonClassName = "bg-green-500 hover:bg-green-500";
            buttonDisableClassName = "bg-green-200 hover:bg-green-200";
            Icon = <CheckIcon />;
            break;
        }
        case "edit": {
            buttonClassName = "bg-blue-600 hover:bg-blue-600";
            buttonDisableClassName = "bg-violet-300 hover:bg-violet-300";
            Icon = <EditIcon />;
            break;
        }
        case "view": {
            buttonClassName = "bg-violet-600 hover:bg-violet-600";
            buttonDisableClassName = "bg-violet-300 hover:bg-violet-300";
            Icon = <VisibilityIcon />;
            break;
        }
    }

    return (
        <button
            className={`btn ${buttonClassName} text-white ${
                disabled && buttonDisableClassName
            } ${className}`}
            onClick={() => {
                if (onClick) onClick();
            }}
            type='button'
        >
            {Icon} {label}
        </button>
    );
}

export default MyButton;
