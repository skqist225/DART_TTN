import React from "react";
import { tailwindCss } from "../../tailwind";
import { MyButton } from "../common";
import $ from "jquery";
import { getImage } from "../../helpers";
import { deleteUser, setEditedUser } from "../../features/userSlice";

function UserTableModal({ rows, setIsEdit, dispatch }) {
    function lookupUserSex(level) {
        switch (level) {
            case "MALE":
                return "Nam";
            case "FEMALE":
                return "Nữ";
            case "OTHER":
                return "Khác";
        }
    }

    function lookupRole(role) {
        switch (role) {
            case "Admin":
                return "Quản trị viên";
            case "Student":
                return "Sinh viên";
            case "Teacher":
                return "Giảng viên";
        }
    }

    return (
        <tbody>
            {rows.map(row => (
                <tr className={tailwindCss.tr} key={row.id}>
                    <td className='p-4 w-4'>
                        <div className='flex items-center'>
                            <input
                                id='checkbox-table-search-1'
                                type='checkbox'
                                className={tailwindCss.checkbox}
                            />
                            <label for='checkbox-table-search-1' className='sr-only'>
                                checkbox
                            </label>
                        </div>
                    </td>
                    <td className='py-4 px-6  whitespace-nowrap dark:text-white'>{row.id}</td>
                    <td className='py-4 px-6'>
                        <div className='normal-flex' style={{ width: "300px" }}>
                            <img src={getImage(row.avatarPath)} className='image' />
                            <span className='listings__room-name'>{row.fullName}</span>
                        </div>
                    </td>
                    <td className='py-4 px-6'>
                        <div style={{ maxWidth: "20px" }}>
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
                        </div>
                    </td>
                    <td className='py-4 px-6'>{row.birthday}</td>
                    <td className='py-4 px-6'>{row.address}</td>
                    <td className='py-4 px-6'>{row.email}</td>
                    <td className='py-4 px-6'>{lookupUserSex(row.sex)}</td>
                    <td className='py-4 px-6'>{row.class && row.cls.name}</td>
                    <td className='py-4 px-6'>{lookupRole(row.role.name)}</td>
                    <td class='py-4 px-6 flex items-center'>
                        <MyButton
                            type='edit'
                            onClick={() => {
                                $("#userModal").css("display", "flex");
                                setIsEdit(true);
                                dispatch(setEditedUser(row));
                            }}
                        />
                        <div className='mx-3'>
                            <MyButton
                                type='disable'
                                onClick={() => {
                                    dispatch(deleteUser(row.id));
                                }}
                            />
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default UserTableModal;
