import React from "react";
import { useSelector } from "react-redux";
import { roleState } from "../../features/roleSlice";
import { fetchAllUsers, userState } from "../../features/userSlice";
import { tailwindCss } from "../../tailwind";
import Select from "../utils/userInputs/Select";
import $ from "jquery";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

function UserFilter() {
    const dispatch = useDispatch();
    const { roles } = useSelector(roleState);
    const { filterObject } = useSelector(userState);
    const { register, handleSubmit } = useForm();

    const handleRoleChange = ({ target: { value } }) => {
        dispatch(fetchAllUsers({ ...filterObject, roleName: value }));
    };

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
            }}
            className='flex items-center'
        >
            <div className='mr-2 w-full flex items-center'>
                <Select
                    label='vai trò'
                    register={register}
                    name='rolesFilter'
                    options={roles.map(role => ({
                        title: role.name,
                        value: role.name,
                    }))}
                    hiddenOption={true}
                    onChangeHandler={handleRoleChange}
                    width={"w-48"}
                />
            </div>
            <div>
                <button
                    type='button'
                    className={tailwindCss.clearFilterButton}
                    onClick={() => {
                        dispatch(
                            fetchAllUsers({
                                page: 1,
                                query: "",
                                sortField: "id",
                                sortDir: "desc",
                            })
                        );

                        $("#rolesFilter").val("");
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default UserFilter;
