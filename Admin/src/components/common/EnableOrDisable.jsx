import React from "react";
import { useDispatch } from "react-redux";
import MyButton from "./MyButton";

function EnableOrDisable({ status, enableOrDisable, id, taken = false, creditClassPage = false }) {
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
                    disabled={taken}
                />
            ) : (
                <MyButton
                    type='enable'
                    onClick={() => {
                        dispatch(enableOrDisable({ id, action: "enable" }));
                    }}
                    disabled={taken}
                />
            )}
        </div>
    );
}

export default EnableOrDisable;
