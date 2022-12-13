import React from "react";
import { useDispatch } from "react-redux";
import MyButton from "./MyButton";

function EnableOrDisable({
    status,
    enableOrDisable,
    id,
    creditClassPage = false,
    disabled = false,
    label,
    customTooltipMessage = "",
}) {
    const dispatch = useDispatch();

    let tempStatus = status;
    if (creditClassPage) {
        tempStatus = !status;
    }

    return (
        <div>
            {tempStatus ? (
                <MyButton
                    label={label}
                    type='disable'
                    onClick={() => {
                        dispatch(
                            enableOrDisable({
                                id,
                                action: "disable",
                            })
                        );
                    }}
                    disabled={disabled}
                    customTooltipMessage={customTooltipMessage}
                />
            ) : (
                <MyButton
                    label={label}
                    type='enable'
                    onClick={() => {
                        dispatch(enableOrDisable({ id, action: "enable" }));
                    }}
                    disabled={disabled}
                    customTooltipMessage={customTooltipMessage}
                />
            )}
        </div>
    );
}

export default EnableOrDisable;
