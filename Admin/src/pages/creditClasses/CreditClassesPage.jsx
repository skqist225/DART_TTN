import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Frame,
  CreditClassModalBody,
  CreditClassTableBody,
  Table,
} from "../../components";
import {
  addCreditClass,
  clearCreditClassState,
  editCreditClass,
  fetchAllCreditClasses,
  creditClassState,
} from "../../features/creditClassSlice";
import { useForm } from "react-hook-form";
import { callToast } from "../../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";
import { creditClassSchema } from "../../validation";

const columns = [
  {
    name: "Mã LTC",
    sortField: "id",
    sortable: true,
  },
  {
    name: "Niên khóa",
    sortField: "schoolYear",
    sortable: true,
  },
  {
    name: "Học kỳ",
    sortField: "semester",
    sortable: true,
  },
  {
    name: "Môn học",
    sortField: "subject",
    sortable: true,
  },
  {
    name: "Nhóm",
    sortField: "group",
    sortable: true,
  },
  {
    name: "Số sinh viên tối thiểu",
    sortField: "minimumNumberOfStudents",
    sortable: true,
  },
  {
    name: "Giảng viên",
    sortField: "teacher",
    sortable: true,
  },
];

function CreditCreditClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(creditClassSchema),
  });

  const onSubmit = (data) => {
    if (isEdit) {
      dispatch(editCreditClass(data));
    } else {
      dispatch(addCreditClass(data));
    }
  };

  const {
    classes,
    totalElements,
    totalPages,
    filterObject,
    addCreditClass: { successMessage },
    editCreditClass: { successMessage: esSuccessMessage },
    deleteCreditClass: { successMessage: dsSuccessMessage },
  } = useSelector(creditClassState);

  const handleQueryChange = ({ target: { value: query } }) => {
    dispatch(
      fetchAllCreditClasses({
        ...filterObject,
        query,
      })
    );
  };

  const handleSortChange = (sortField, sortDir) => {
    dispatch(
      fetchAllCreditClasses({
        ...filterObject,
        sortField,
        sortDir,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(clearCreditClassState());
    };
  }, []);

  function closeForm(successMessage) {
    callToast("success", successMessage);
    $("#classForm")[0].reset();
    $("#classModal").css("display", "none");
    dispatch(fetchAllCreditClasses(filterObject));
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
      dispatch(fetchAllCreditClasses(filterObject));
    }
  }, [dsSuccessMessage]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchAllCreditClasses({
        page: 1,
      })
    );
  }, []);

  return (
    <Frame
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      title={"DANH SÁCH LỚP TÍN CHỈ"}
      children={
        <Table
          searchPlaceHolder={"Tìm kiếm theo tên và mã lớp"}
          handleQueryChange={handleQueryChange}
          handleSortChange={handleSortChange}
          columns={columns}
          totalElements={totalElements}
          totalPages={totalPages}
          TableBody={
            <CreditClassTableBody
              rows={classes}
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
              <CreditClassModalBody
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

export default CreditCreditClassesPage;
