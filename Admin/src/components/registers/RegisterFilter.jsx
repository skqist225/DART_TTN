import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { creditClassState, fetchAllCreditClasses } from "../../features/creditClassSlice";
import { fetchAllRegisters } from "../../features/registerSlice";
import { subjectState } from "../../features/subjectSlice";
import Select from "../utils/userInputs/Select";

function RegisterFilter() {
    const dispatch = useDispatch();
    const { creditClasses, filterObject } = useSelector(creditClassState);
    const { register, handleSubmit } = useForm();

    const handleCreditClassChange = event => {
        dispatch(fetchAllRegisters({ ...filterObject, creditClass: event.target.value }));
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
            <div className='mr-2 w-full flex items-center justify-start'>
                <Select
                    label='lớp tín chỉ'
                    name='creditClassFilter'
                    register={register}
                    options={creditClasses.map(
                        ({ id, schoolYear, semester, subjectName, group }) => ({
                            title: `${schoolYear} ${semester} ${subjectName} ${group}`,
                            value: id,
                        })
                    )}
                    onChangeHandler={handleCreditClassChange}
                    hiddenOption
                    width={"w-52"}
                />
            </div>
            <div>
                <button
                    type='button'
                    className='text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-40'
                    onClick={() => {
                        dispatch(
                            fetchAllRegisters({
                                page: 1,
                                query: "",
                                sortField: "id",
                                sortDir: "desc",
                                subject: "",
                            })
                        );
                        dispatch(setResetFilter(true));
                    }}
                >
                    Xóa bộ lọc
                </button>
            </div>
        </form>
    );
}

export default RegisterFilter;
