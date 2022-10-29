import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import slugify from "slugify";
import { findSubject, subjectState } from "../features/subjectSlice";

function TestsPage() {
    const dispatch = useDispatch();
    const { subject } = useSelector(subjectState);
    const { id } = useParams();
    console.log(id);

    useEffect(() => {
        dispatch(findSubject({ subjectId: id }));
    }, []);

    return (
        <div>
            <div>
                <div>
                    <div>
                        {subject.numberOfTests} Đề Thi {subject.name} Có Đáp Án
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestsPage;
