import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  clearErrorField,
  setEditedCreditClass,
  creditClassState,
} from "../../features/creditClassSlice";
import Input from "../utils/userInputs/Input";

function ExamModalBody({ errors, register, dispatch, setValue }) {
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

  return (
    <div className="mt-5">
      <div className="col-flex items-center justify-center w-full">
        <div className="w-full">
          <Input
            label="Mã Lớp *"
            error={
              (errors.id && errors.id.message) ||
              (errorObject && errorObject.id)
            }
            register={register}
            name="id"
            onKeyDown={onKeyDown}
            readOnly={editedCreditClass}
          />
        </div>
        <div className="w-full my-5">
          <Input
            label="Tên lớp *"
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

export default ExamModalBody;
