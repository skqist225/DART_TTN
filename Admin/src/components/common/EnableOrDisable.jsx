import React from "react";
import { useDispatch } from "react-redux";
import MyButton from "./MyButton";

function EnableOrDisable({ status, enableOrDisable, id, creditClassPage = false }) {
    const dispatch = useDispatch();
    return (
        <div>
            {creditClassPage ? (
                !status
            ) : status ? (
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
                />
            ) : (
                <MyButton
                    type='enable'
                    onClick={() => {
                        dispatch(enableOrDisable({ id, action: "enable" }));
                    }}
                />
            )}
        </div>
    );
}

export default EnableOrDisable;
