import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  clearErrorField,
  creditClassState,
} from "../../features/creditClassSlice";
import { fetchAllTests, testState } from "../../features/testSlice";
import DatePicker from "../utils/datePicker/DatePicker";
import Input from "../utils/userInputs/Input";
import Select from "../utils/userInputs/Select";

function ExamModalBody({ errors, register, dispatch, setValue }) {
  const { editedCreditClass, errorObject, creditClasses } =
    useSelector(creditClassState);
  const { tests } = useSelector(testState);

  const onKeyDown = ({ target: { name } }) => {
    if (errorObject) {
      dispatch(clearErrorField(name));
    }
  };

  useEffect(() => {
    if (editedCreditClass) {
      setValue("id", editedCreditClass.id);
      setValue("name", editedCreditClass.name);
    } else {
      setValue("id", editedCreditClass.id);
      setValue("name", editedCreditClass.name);
    }
  }, [editedCreditClass]);

  const handleCreditClassChanged = ({ target: value }) => {
    const creditClass = creditClasses.find(({ id }) => id === value);
    dispatch(fetchAllTests({ page: 0, subjectId: creditClass.subject.id }));
  };

  return (
    <div className="mt-5">
      <div className="col-flex items-center justify-center w-full">
        <div className="w-full my-5 flex items-center">
          <div className="mr-5 w-full">
            <Select
              label="Lớp tín chỉ *"
              register={register}
              name="creditClassId"
              options={creditClasses.map(
                ({ id, schoolYear, semester, subject, group }) => ({
                  title: `${schoolYear} ${semester} ${subject.name} ${group}`,
                  value: id,
                })
              )}
              error={errors.creditClassId && errors.creditClassId.message}
              setValue={setValue}
              defaultValue={
                creditClasses && creditClasses.length && creditClasses[0].id
              }
              onChangeHandler={handleCreditClassChanged}
            />
          </div>
          <div className="w-full">
            <Select
              label="Bộ đề *"
              register={register}
              name="testId"
              options={tests.map(({ id, name }) => ({
                title: name,
                value: id,
              }))}
              // error={errors.testId && errors.testId.message}
              setValue={setValue}
              defaultValue={tests && tests.length && tests[0].id}
              multiple
            />
          </div>
        </div>
        <div className="w-full my-5 flex items-center">
          <div className="mr-5 w-full">
            <DatePicker
              register={register}
              name="examDate"
              error
              lavel={"Ngày thi *"}
            />
          </div>
          <div className="w-full">
            <Input
              label="Thời gian làm bài *"
              error={errors.time && errors.time.message}
              register={register}
              name="time"
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
        <div>
          <Input
            label="Loại kỳ thi"
            error={errors.typeOfExam && errors.typeOfExam.message}
            register={register}
            name="typeOfExam"
            onKeyDown={onKeyDown}
          />
        </div>
        <div>
          <Input
            type="checkbox"
            label="Tự tạo ca thi với số thi sinh tương tự"
            register={register}
            name="automateCreatingExam"
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default ExamModalBody;
