import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { creditClassState } from "../../features/creditClassSlice";
import { registerState } from "../../features/registerSlice";
import { fetchAllUsers, userState } from "../../features/userSlice";
import ExcelModalBody from "../utils/forms/ExcelModalBody";
import Select from "../utils/userInputs/Select";

function RegisterModalBody({ errors, register, setValue, setExcelFile }) {
    const dispatch = useDispatch();

    const { creditClasses } = useSelector(creditClassState);
    const { registerExcelAdd } = useSelector(registerState);

    const { users } = useSelector(userState);

    useEffect(() => {
        if (creditClasses && creditClasses.length) {
            handleCreditClassChange({ target: { value: creditClasses[0].id } });
        }
    }, [creditClasses]);

    const handleCreditClassChange = ({ target: { value } }) => {
        dispatch(fetchAllUsers({ page: 0, role: "Sinh viên", limit: 100, creditClass: value }));
    };

    return (
        <div>
            {!registerExcelAdd ? (
                <div className='col-flex items-center justify-center w-full'>
                    <div className='w-full my-5 flex items-center'>
                        <div className='mr-5 w-full'>
                            <Select
                                label='Lớp tín chỉ *'
                                register={register}
                                name='creditClassId'
                                options={creditClasses.map(
                                    ({ id, schoolYear, semester, subjectName, group }) => ({
                                        title: `${schoolYear} ${semester} ${subjectName} ${group}`,
                                        value: id,
                                    })
                                )}
                                error={errors.creditClassId && errors.creditClassId.message}
                                setValue={setValue}
                                defaultValue={
                                    creditClasses && creditClasses.length && creditClasses[0].id
                                }
                                onChangeHandler={handleCreditClassChange}
                            />
                        </div>
                    </div>
                    <div className='mr-5 w-full p-4'>
                        <Select
                            label='Danh sách sinh viên *'
                            register={register}
                            name='registerList'
                            options={users.map(({ id, fullName }) => ({
                                title: `${id} ${fullName}`,
                                value: id,
                            }))}
                            setValue={setValue}
                            multiple
                            height='h-90'
                        />
                    </div>
                </div>
            ) : (
                <ExcelModalBody setExcelFile={setExcelFile} />
            )}
        </div>
    );
}

export default RegisterModalBody;
