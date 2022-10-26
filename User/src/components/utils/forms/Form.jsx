import { Box } from "@mui/material";
import React from "react";

function Form({ id, handleSubmit, onSubmit, children, tailwindCss }) {
    return (
        <Box sx={{ width: "80%", marginTop: "20px", margin: "0 auto" }}>
            <form
                id={id}
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit(onSubmit)(e);
                }}
            >
                {children}
                <div className='my-3'>
                    <button type='submit' className={tailwindCss.button}>
                        Tạo môn học
                    </button>
                </div>
            </form>
        </Box>
    );
}

export default Form;
