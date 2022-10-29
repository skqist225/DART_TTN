import React from "react";
import QuizIcon from "@mui/icons-material/Quiz";
import { Link } from "react-router-dom";
import slugify from "slugify";

function SubjectSummary({ subject }) {
    return (
        <div
            className='h-28 rounded-lg px-4 py-3 mb-4'
            style={{ background: "rgba(0, 173, 182,0.1)" }}
        >
            <div>
                <img src='' alt='' />
            </div>
            <div>
                <div className='text-base mb-1'>{subject.name}</div>
                <Link to={`/tests/${subject.id}`}>
                    <div>
                        <span>
                            <QuizIcon />
                        </span>
                        {subject.numberOfTests} Bài thi
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default SubjectSummary;
