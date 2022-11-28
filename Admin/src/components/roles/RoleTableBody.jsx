import React from "react";
import { tailwindCss } from "../../tailwind";
import MyButton from "../common/MyButton";
import $ from "jquery";
import { deleteRole, setEditedRole } from "../../features/roleSlice";
import { useDispatch } from "react-redux";

function RoleTableBody({ rows, setIsEdit }) {
    const dispatch = useDispatch();
    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className={tailwindCss.tableCell}>{row.id}</td>
                    <td className={tailwindCss.tableCell}>{row.name}</td>
                    <td class={`${tailwindCss.tableCell} flex items-center`}>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#roleModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedRole(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='delete'
                                onClick={() => {
                                    dispatch(deleteRole(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default RoleTableBody;
