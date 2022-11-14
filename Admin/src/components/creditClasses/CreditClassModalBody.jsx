import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  clearErrorField,
  setEditedCreditClass,
  creditClassState,
} from "../../features/creditClassSlice";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

function CreditClassModalBody({ errors, register, dispatch, setValue }) {
  const { editedCreditClass, errorObject } = useSelector(creditClassState);

  const onKeyDown = ({ target: { name } }) => {
    if (errorObject) {
      dispatch(clearErrorField(name));
    }
  };

  useEffect(() => {
    if (editedCreditClass) {
      setValue("id", editedCreditClass.id);
      setValue("name", editedCreditClass.name);
    }
  }, [editedCreditClass]);

  const handleTypeChange = () => {

  }

  return (
    <div className="mt-5">
      <div className="col-flex items-center justify-center w-full">
        <div className="flex items-center w-full my-3">
          <div className="mr-5 w-full">
            <Select
              label="Niên khóa *"
              register={register}
              name="type"
              // options={types}
              setValue={setValue}
              onChangeHandler={handleTypeChange}
            />
          </div>
          <div className="w-full">
            <Select
              label="Học kỳ *"
              register={register}
              name="level"
              // options={levelOptions}
              setValue={setValue}
            />
          </div>
        </div>
        <div className="flex items-center w-full my-3">
          <div className="mr-5 w-full">
            <Select
              label="Môn học *"
              register={register}
              name="type"
              // options={types}
              setValue={setValue}
              onChangeHandler={handleTypeChange}
            />
          </div>
          <div className="w-full">
            <Select
              label="Nhóm *"
              register={register}
              name="level"
              // options={levelOptions}
              setValue={setValue}
            />
          </div>
        </div>
        <div className="w-full my-5">
          <Input
            label="Số SV tối thiểu *"
            error={
              (errors.name && errors.name.message) ||
              (errorObject && errorObject.name)
            }
            register={register}
            name="name"
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default CreditClassModalBody;
