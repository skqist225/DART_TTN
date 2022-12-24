import { Badge } from "flowbite-react";
import $ from "jquery";
import React from "react";
import { useDispatch } from "react-redux";
import { EnableOrDisable, MyButton } from "..";
import { deleteUser, enableOrDisableUser, setEditedUser } from "../../features/userSlice";
import { getImage } from "../../helpers";
import { tailwindCss } from "../../tailwind";

function UserTableModal({ rows, setIsEdit }) {
    const dispatch = useDispatch();

    const lookupSex = sex => {
        return sex === "MALE" ? "Nam" : "Nữ";
    };

    return (
        <tbody>
            {rows.map(row => {
                const isAdmin = row.roles.map(({ name }) => name).includes("Quản trị viên");

                let shouldDoActionMessage = "";

                if (isAdmin) {
                    shouldDoActionMessage = "Không thể thao tác với tài khoản quản trị viên";
                }

                return (
                    <tr
                        className={`${tailwindCss.tr} ${
                            !row.status && "bg-gray-200 hover:bg-gray-200"
                        }`}
                        key={row.id}
                    >
                        <td className={tailwindCss.tableCell}>{row.id}</td>
                        <td className={tailwindCss.tableCell}>
                            <div className='flex items-center'>
                                <div className='normal-flex' style={{ width: "200px" }}>
                                    <img src={getImage(row.avatarPath)} className='image' />
                                    <span className='listings__room-name'>{row.fullName}</span>
                                </div>
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
                                </div>
                            </div>
                        </td>
                        <td className={tailwindCss.tableCell}>{`${row.birthday.split("-")[2]}/${
                            row.birthday.split("-")[1]
                        }/${row.birthday.split("-")[0]}`}</td>
                        <td className={tailwindCss.tableCell}>{row.email}</td>
                        <td className={tailwindCss.tableCell}>{lookupSex(row.sex)}</td>
                        <td className={tailwindCss.tableCell}>{row.address}</td>
                        <td className={tailwindCss.tableCell}>
                            {row.roles.map(role => (
                                <Badge color='purple'>{role.name}</Badge>
                            ))}
                        </td>
                        <td class={`${tailwindCss.tableCell} flex items-center`}>
                            <MyButton
                                type='edit'
                                onClick={() => {
                                    $("#userModal").css("display", "flex");
                                    setIsEdit(true);
                                    dispatch(setEditedUser(row));
                                }}
                                disabled={isAdmin}
                                customTooltipMessage={shouldDoActionMessage}
                            />
                            <div className='mx-3'>
                                <EnableOrDisable
                                    id={row.id}
                                    status={row.status}
                                    enableOrDisable={enableOrDisableUser}
                                    disabled={isAdmin}
                                    customTooltipMessage={shouldDoActionMessage}
                                />
                            </div>
                            <div className='mx-1'>
                                <MyButton
                                    type='delete'
                                    onClick={() => {
                                        dispatch(deleteUser(row.id));
                                    }}
                                    disabled={isAdmin}
                                    customTooltipMessage={shouldDoActionMessage}
                                />
                            </div>
                        </td>
                    </tr>
                );
            })}
        </tbody>
    );
}

export default UserTableModal;
