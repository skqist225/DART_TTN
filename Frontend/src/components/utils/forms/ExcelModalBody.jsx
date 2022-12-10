import React from "react";
import { tailwindCss } from "../../../tailwind";

function ExcelModalBody({ setExcelFile, id }) {
    return (
        <div id={id}>
            <div>
                <label
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                    htmlFor='file_input'
                >
                    Chọn file Excel
                </label>
                <input
                    className={tailwindCss.fileInput}
                    id='file_input'
                    type='file'
                    onChange={event => {
                        if (setExcelFile) {
                            setExcelFile(event.target.files[0]);
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default ExcelModalBody;
