import React from "react";
import { useDispatch } from "react-redux";
import MyButton from "./MyButton";

function EnableOrDisable({
    status,
    enableOrDisable,
    id,
    creditClassPage = false,
    disabled = false,
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
                />
            ) : (
                <MyButton
                    type='enable'
                    onClick={() => {
                        dispatch(enableOrDisable({ id, action: "enable" }));
                    }}
                    disabled={disabled}
                />
            )}
        </div>
    );
}

export default EnableOrDisable;
