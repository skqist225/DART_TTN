import React from "react";
import { tailwindCss } from "../../tailwind";
import { MyButton } from "..";
import $ from "jquery";
import { getImage } from "../../helpers";
import { deleteUser, enableOrDisableUser, setEditedUser } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import { cellCss } from "../questions/QuestionTableBody";
import { Badge } from "flowbite-react";

function UserTableModal({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    const lookupSex = sex => {
        return sex === "MALE" ? "Nam" : "Nữ";
    };

    return (
        <tbody>
            {rows.map(row => (
                <tr
                    className={`${tailwindCss.tr} ${
                        !row.status && "bg-gray-200 hover:bg-gray-200"
                    }`}
                    key={row.id}
                >
                    <td className={cellCss}>{row.id}</td>
                    <td className={cellCss}>
                        <div className='normal-flex' style={{ width: "150px" }}>
                            <img src={getImage(row.avatarPath)} className='image' />
                            <span className='listings__room-name'>{row.fullName}</span>
                        </div>
                    </td>
                    <td className={cellCss} style={{ width: "150px" }}>
                        <div className='normal-flex'>
                            <div className='mr-10'>
                                {row.status === true ? (
                                    <svg
                                        viewBox='0 0 16 16'
                                        xmlns='http://www.w3.org/2000/svg'
                                        style={{
                                            display: "block",
                                            height: "16px",
                                            width: "16px",
                                            fill: "#008a05",
                                        }}
                                        aria-hidden='true'
                                        role='presentation'
                                        focusable='false'
                                    >
                                        <path d='M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zm3.159 4.869L6.67 9.355 4.42 7.105 3.289 8.236 6.67 11.62 12.291 6z'></path>
                                    </svg>
                                ) : (
                                    <img
                                        src={getImage("/svg/reddot.svg")}
                                        width='10px'
                                        height='10px'
                                        className='mr-10'
                                    />
                                )}
                            </div>
                            <div>{row.status === true ? "Hoạt động" : "Hủy"}</div>
                        </div>
                    </td>
                    <td className={cellCss}>{row.birthday}</td>
                    <td className={cellCss}>{row.address}</td>
                    <td className={cellCss}>{row.email}</td>
                    <td className={cellCss}>{lookupSex(row.sex)}</td>
                    <td className={cellCss}>
                        {row.roles.map(role => (
                            <Badge color='purple'>{role.name}</Badge>
                        ))}
                    </td>
                    <td class={`${cellCss} flex items-center`}>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#userModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedUser(row));
                            }}
                        />
                        <div className='mx-3'>
                            {row.status ? (
                                <MyButton
                                    type='disable'
                                    onClick={() => {
                                        dispatch(
                                            enableOrDisableUser({
                                                id: row.id,
                                                action: "disable",
                                            })
                                        );
                                    }}
                                />
                            ) : (
                                <MyButton
                                    type='enable'
                                    onClick={() => {
                                        dispatch(
                                            enableOrDisableUser({
                                                id: row.id,
                                                action: "enable",
                                            })
                                        );
                                    }}
                                />
                            )}
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default UserTableModal;
