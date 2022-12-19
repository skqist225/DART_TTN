import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "../utils/userInputs/Select";
import Input from "../utils/userInputs/Input";
import { userState } from "../../features/userSlice";
import DatePicker from "../utils/datePicker/DatePicker";
import FileInput from "../utils/userInputs/FileInput";
import { roleState } from "../../features/roleSlice";
import ExcelModalBody from "../utils/forms/ExcelModalBody";
import $ from "jquery";

export const sexOptions = [
    {
        title: "Nam",
        value: "MALE",
    },
    {
        title: "Nữ",
        value: "FEMALE",
    },
];

function UserModalBody({ errors, register, dispatch, setValue, setImage, isEdit, setExcelFile }) {
    const { editedUser, errorObject, userExcelAdd } = useSelector(userState);
    const { roles } = useSelector(roleState);

    useEffect(() => {
        if (editedUser) {
            setValue("id", editedUser.id);
            setValue("firstName", editedUser.firstName);
            setValue("lastName", editedUser.lastName);
            setValue("email", editedUser.email);

            let birthday = editedUser.birthday.split("-");
            birthday = `${birthday[2]}/${birthday[1]}/${birthday[0]}`;
            setValue("birthday", birthday);

            setValue("sex", editedUser.sex);
            setValue("address", editedUser.address);
        } else {
            setValue("id", "");
            setValue("firstName", "");
            setValue("lastName", "");
            setValue("email", "");
            setValue("password", "");
            setValue("birthday", "");
            setValue("sex", "");
            setValue("address", "");
            setValue("roles", []);
            setImage(null);
            $("#imagePreview").attr("src", "");
        }
    }, [editedUser]);

    return (
        <div>
            {!userExcelAdd ? (
                <div>
                    <div className='col-flex items-center justify-center w-full'>
                        <div className='w-full mb-5'>
                            <div>
                                <Input
                                    label='Mã người dùng *'
                                    error={
                                        (errors.id && errors.id.message) ||
                                        (errorObject && errorObject.id)
                                    }
                                    register={register}
                                    name='id'
                                    readOnly={isEdit}
                                />
                            </div>
                        </div>
                        <div className='w-full flex items-start mb-5'>
                            <div className='flex-1  mr-5'>
                                <Input
                                    label='Họ *'
                                    error={errors.lastName && errors.lastName.message}
                                    register={register}
                                    name='lastName'
                                />
                            </div>
                            <div className='flex-1'>
                                <Input
                                    label='Tên *'
                                    error={errors.firstName && errors.firstName.message}
                                    register={register}
                                    name='firstName'
                                />
                            </div>
                        </div>
                        <div className='flex items-start w-full mb-5'>
                            <div className={`flex-1 mr-5`}>
                                <Input
                                    label='Địa chỉ email *'
                                    error={errors.email && errors.email.message}
                                    register={register}
                                    name='email'
                                    type='email'
                                />
                            </div>
                            <div className='flex-1'>
                                <Input
                                    label='Mật khẩu *'
                                    error={
                                        !editedUser && errors.password && errors.password.message
                                    }
                                    register={register}
                                    name='password'
                                    type='password'
                                />
                            </div>
                        </div>

                        <div className='flex items-start w-full mb-5'>
                            <div className='flex-1 mr-5'>
                                <DatePicker
                                    error={errors.birthday && errors.birthday.message}
                                    register={register}
                                    name='birthday'
                                    label='Ngày sinh *'
                                />
                            </div>
                            <div className='flex-1'>
                                <Select
                                    label='Giới tính *'
                                    error={errors.sex && errors.sex.message}
                                    register={register}
                                    name='sex'
                                    options={sexOptions}
                                    defaultValue={sexOptions && sexOptions[0] && sexOptions[0].id}
                                />
                            </div>
                        </div>
                        <div className='w-full mb-5 flex items-center'>
                            <div className='w-full mr-5'>
                                <Input
                                    label='Địa chỉ'
                                    register={register}
                                    name='address'
                                    type='address'
                                />
                            </div>{" "}
                            <div className='w-full'>
                                <Select
                                    label='Vai trò *'
                                    error={errors.roles && errors.roles.message}
                                    register={register}
                                    name='roles'
                                    options={roles.map(role => ({
                                        title: role.name,
                                        value: role.id,
                                    }))}
                                    defaultValue={
                                        editedUser && editedUser.roles.map(({ id }) => id)
                                    }
                                    setValue={setValue}
                                    multiple
                                    readOnly={editedUser && editedUser.id.startsWith("N")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <FileInput setImage={setImage} image={editedUser && editedUser.avatarPath} /> */}
                </div>
            ) : (
                <ExcelModalBody setExcelFile={setExcelFile} />
            )}
        </div>
    );
}

export default UserModalBody;
