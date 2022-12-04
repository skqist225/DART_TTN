import React, { useState } from "react";
import { useSelector } from "react-redux";
import { tailwindCss } from "../../../tailwind";
import "./css/tableHeader.css";
import { persistUserState } from "../../../features/persistUserSlice";
import $ from "jquery";

function TableHeader({
    columns,
    handleSortChange,
    modalLabel,
    addCheckbox = false,
    chapterListPage = false,
}) {
    const [sortDir, setSortDir] = useState("asc");

    function reverseSortDir(selectedClassName) {
        $(".sort").filter(".active").removeClass("active");
        $(selectedClassName).addClass("active");

        if (selectedClassName.includes("upper")) {
            setSortDir("desc");
        } else {
            setSortDir("asc");
        }
    }

    function sortData(event, sortField) {
        handleSortChange(sortField, sortDir);

        sortDir === "asc"
            ? reverseSortDir(`.upper.${sortField}`)
            : reverseSortDir(`.downer.${sortField}`);
    }
    const { userRoles } = useSelector(persistUserState);
    // console.log(modalLabel);
    return (
        <thead className={tailwindCss.thead}>
            <tr>
                {addCheckbox && <th></th>}
                {columns.map(({ name, sortField, sortable }) => {
                    if (
                        ["ca thi", "câu hỏi"].includes(modalLabel) &&
                        !userRoles.includes("Quản trị viên") &&
                        name === "Giảng viên"
                    ) {
                        return null;
                    }

                    if (chapterListPage && name === "Chương") {
                        return null;
                    }
                    return (
                        <th scope='col' className='py-2 px-3' key={name}>
                            {!sortable ? (
                                name
                            ) : (
                                <button
                                    className='table--header__sortButton'
                                    onClick={e => {
                                        sortData(e, sortField);
                                    }}
                                >
                                    <div className='flex items-center'>
                                        {name}
                                        <div className='col-flex ml-2'>
                                            <span className={"upper sort " + sortField}></span>
                                            <span className={"downer sort " + sortField}></span>
                                        </div>
                                    </div>
                                </button>
                            )}
                        </th>
                    );
                })}
            </tr>
        </thead>
    );
}

export default TableHeader;
