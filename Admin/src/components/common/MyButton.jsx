import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import DisableImage from "../../images/disable-icon.png";
import { Tooltip } from "flowbite-react";

function MyButton(props) {
    let { type, label, disabled } = props;
    let buttonClassName = "",
        buttonDisableClassName = "";
    switch (type) {
        case "add": {
            label = `Add ${label}`;
            buttonClassName = "bg-indigo-500 hover:bg-indigo-600";
            break;
        }
        case "update": {
            label = `Update ${label}`;
            buttonClassName = "bg-indigo-500 hover:bg-indigo-600";
            break;
        }
        case "delete": {
            buttonClassName = "bg-rose-500 hover:bg-rose-500";
            buttonDisableClassName = "bg-rose-200 hover:bg-rose-200";
            break;
        }
        case "disable": {
            // buttonClassName = "bg-white-500 hover:bg-white-500";
            buttonClassName = "bg-rose-500 hover:bg-rose-500";
            buttonDisableClassName = "bg-rose-200 hover:bg-rose-200";
            break;
        }
        case "enable": {
            buttonClassName = "bg-green-500 hover:bg-green-500";
            buttonDisableClassName = "bg-green-200 hover:bg-green-200";
            break;
        }
        case "deny": {
            if (disabled) {
                buttonDisableClassName = "bg-rose-200 hover:bg-rose-200";
            } else {
                buttonClassName = "bg-rose-500 hover:bg-rose-500";
            }
            break;
        }
        case "edit": {
            buttonClassName = "bg-blue-500 hover:bg-blue-500";
            break;
        }
        case "currentPosition": {
            buttonClassName = "bg-emerald-600 hover:bg-emerald-600";
            break;
        }
        case "lookGood": {
            buttonClassName = "bg-rose-500 hover:bg-rose-500";
            break;
        }
        case "cancel": {
            buttonClassName = "bg-teal-500";
            break;
        }
        case "view": {
            if (label === "Booking") {
                buttonClassName = "bg-blue-600 hover:bg-blue-600";
            } else {
                buttonClassName = "bg-green-500 hover:bg-green-500";
            }
            break;
        }
        case "approve": {
            if (disabled) {
                buttonDisableClassName = "bg-green-200 hover:bg-green-200";
            } else {
                buttonClassName = "bg-green-500 hover:bg-green-500";
            }
            break;
        }
        case "next": {
            if (disabled) buttonDisableClassName = "bg-blue-200 hover:bg-blue-200";
            else buttonClassName = "bg-blue-500 hover:bg-blue-500";
            break;
        }
        case "back": {
            if (disabled) buttonDisableClassName = "bg-blue-200 hover:bg-blue-200";
            else buttonClassName = "bg-blue-500 hover:bg-blue-500";
            break;
        }
        case "search": {
            buttonClassName = "bg-blue-500 hover:bg-blue-500";
            break;
        }
        case "clearFilter": {
            buttonClassName = "bg-violet-400 hover:bg-violet-400";
            break;
        }
    }

    return (
        // <Tooltip placement='top' animation='duration-300' style='light' content={label}>
        <button
            className={`btn ${buttonClassName} text-white ${
                props.disabled && buttonDisableClassName
            }`}
            {...props}
            type='button'
        >
            {type === "add" && (
                <svg className='w-4 h-4 fill-current opacity-50 shrink-0' viewBox='0 0 16 16'>
                    <path d='M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z' />
                </svg>
            )}
            {type === "delete" && <DeleteIcon />}
            {type === "disable" && (
                <>
                    <img
                        src={DisableImage}
                        style={{
                            maxWidth: "24px",
                            filter: "invert(100%) sepia(64%) saturate(371%) hue-rotate(284deg) brightness(108%) contrast(104%)",
                        }}
                    />
                </>
            )}
            {type === "enable" && <CheckIcon />}
            {type === "edit" && <EditIcon />}
            {type === "view" && <VisibilityIcon />}
            {type === "add" && <span className='hidden xs:block ml-2'>{label}</span>}
            {type === "update" && <span className='hidden xs:block ml-2'>{label}</span>}
            {type === "approve" && <CheckIcon />}
            {type === "deny" && <DoDisturbIcon />}
            {type === "search" && (
                <>
                    <SearchIcon />
                    Search
                </>
            )}
            {type === "clearFilter" && (
                <>
                    <ClearIcon />
                    Clear filter
                </>
            )}
            {type === "cancel" && <>Cancel</>}
        </button>
        // </Tooltip>
    );
}

export default MyButton;
