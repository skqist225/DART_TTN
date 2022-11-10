import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Frame, ExamModalBody, ExamTableBody, Table } from "../../components";
import { examSchema } from "../../validation";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addExam,
  clearExamState,
  editExam,
  examState,
} from "../../features/examSlice";
import $ from "jquery";

const columns = [
  {
    name: "Mã lớp",
    sortField: "id",
    sortable: true,
  },
  {
    name: "Tên lớp",
    sortField: "name",
    sortable: true,
  },
];

function ExamsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(examSchema),
  });

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(editExam(data));
    } else {
      dispatch(addExam(data));
    }
  };

  const {
    exams,
    totalElements,
    totalPages,
    filterObject,
    addExam: { successMessage },
    editExam: { successMessage: esSuccessMessage },
    deleteExam: { successMessage: dsSuccessMessage },
  } = useSelector(examState);

  const handleQueryChange = ({ target: { value: query } }) => {
    dispatch(
      fetchAllExames({
        ...filterObject,
        query,
      })
    );
  };

  const handleSortChange = (sortField, sortDir) => {
    dispatch(
      fetchAllExames({
        ...filterObject,
        sortField,
        sortDir,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(clearExamState());
    };
  }, []);

  function closeForm(successMessage) {
    callToast("success", successMessage);
    $("#classForm")[0].reset();
    $("#classModal").css("display", "none");
    dispatch(fetchAllExames(filterObject));
  }

  useEffect(() => {
    if (successMessage) {
      closeForm(successMessage);
    }
  }, [successMessage]);

  useEffect(() => {
    if (esSuccessMessage) {
      closeForm(successMessage);
      setIsEdit(false);
    }
  }, [esSuccessMessage]);

  useEffect(() => {
    if (dsSuccessMessage) {
      callToast("success", dsSuccessMessage);
      dispatch(fetchAllExames(filterObject));
    }
  }, [dsSuccessMessage]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchAllExames({
        page: 1,
      })
    );
  }, []);

  return (
    <Frame
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title={"DANH SÁCH LỚP HỌC"}
      children={
        <Table
          searchPlaceHolder={"Tìm kiếm theo tên và mã lớp"}
          handleQueryChange={handleQueryChange}
          handleSortChange={handleSortChange}
          columns={columns}
          totalElements={totalElements}
          totalPages={totalPages}
          TableBody={
            <ExamTableBody
              rows={exams}
              setIsEdit={setIsEdit}
              dispatch={dispatch}
              modalId="classModal"
            />
          }
          modalId="classModal"
          formId="classForm"
          modalLabel="lớp"
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          ModalBody={
            <>
              <ExamModalBody
                errors={errors}
                register={register}
                dispatch={dispatch}
                setValue={setValue}
              />
            </>
          }
          isEdit={isEdit}
          setIsEdit={setIsEdit}
        />
      }
    />
  );
}

export default ExamsPage;
