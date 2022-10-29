import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllSubjectsBrief, findSubject, subjectState } from "../features/subjectSlice";
import { DropDownIcon } from "../images";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TestSummary from "../components/tests/TestSummary";

function TestsPage() {
    const dispatch = useDispatch();
    const { subject, subjects } = useSelector(subjectState);
    const { subjectId } = useParams();

    useEffect(() => {
        dispatch(fetchAllSubjectsBrief());
        dispatch(findSubject({ subjectId }));
    }, []);

    return (
        <div>
            <div className='max-w-screen-xl m-auto'>
                <div>
                    <h1 className='text-3xl font-semibold capitalize' style={{ color: "#333d46" }}>
                        {subject.numberOfTests} Đề Thi {subject.name} Có Đáp Án
                    </h1>
                    <div>
                        Trang chủ / <span>{subject.name}</span>
                    </div>
                    <div>Mô tả</div>
                    <div className='flex items-center justify-between'>
                        <div>Đánh giá</div>
                        <div>Chia sẻ</div>
                    </div>
                </div>
                <div className='flex items-start w-full'>
                    <div className='flex-1 w-30 rounded-lg bg-white p-3 max-w-sm mr-7'>
                        <div className='uppercase'>
                            <span>
                                <FilterAltIcon />
                            </span>
                            bộ lọc tìm kiếm
                        </div>
                        <div>
                            <form className='flex items-center'>
                                <label for='simple-search' className='sr-only'>
                                    Search
                                </label>
                                <div className='relative w-full'>
                                    <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                                        <svg
                                            aria-hidden='true'
                                            className='w-5 h-5 text-gray-500 dark:text-gray-400'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                            xmlns='http://www.w3.org/2000/svg'
                                        >
                                            <path
                                                fill-rule='evenodd'
                                                d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                                                clip-rule='evenodd'
                                            ></path>
                                        </svg>
                                    </div>
                                    <input
                                        type='text'
                                        id='simple-search'
                                        className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                        placeholder='Search'
                                        required
                                    />
                                </div>
                                <button
                                    type='submit'
                                    className='p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                >
                                    <svg
                                        className='w-5 h-5'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                        xmlns='http://www.w3.org/2000/svg'
                                    >
                                        <path
                                            stroke-linecap='round'
                                            stroke-linejoin='round'
                                            stroke-width='2'
                                            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                        ></path>
                                    </svg>
                                    <span className='sr-only'>Search</span>
                                </button>
                            </form>
                        </div>
                        <div>
                            {subjects.map(subject => (
                                <div
                                    className='flex items-center justify-between m-1'
                                    key={subject.id}
                                >
                                    <div className='flex items-center'>
                                        <input
                                            checked
                                            id='checked-checkbox'
                                            type='checkbox'
                                            value={subject.id}
                                            className='w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                                        />
                                        <label
                                            htmlFor='checked-checkbox'
                                            className='ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                                        >
                                            {subject.name}
                                        </label>
                                    </div>
                                    <div>{subject.numberOfTests}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex-1 w-70'>
                        <div className='flex items-center justify-between h-15 bg-slate-50 rounded-md mb-4 py-3 px-2'>
                            <h6 style={{ color: "#3c4b52" }} className='font-semibold'>
                                Hiển thị 1-12 của {subject.numberOfTests}
                            </h6>
                            <div>
                                <span className='text-sm mr-3' style={{ color: "#3c4b52" }}>
                                    Sắp xếp theo:
                                </span>
                                <button
                                    id='dropdownDividerButton'
                                    data-dropdown-toggle='dropdownDivider'
                                    className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                    type='button'
                                >
                                    Mới nhất <DropDownIcon />
                                </button>
                                <div
                                    id='dropdownDivider'
                                    className='absolute hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600'
                                    data-popper-reference-hidden=''
                                    data-popper-escaped=''
                                    data-popper-placement='bottom'
                                    style={{
                                        inset: "0px auto auto 0px",
                                        margin: "0px",
                                        transform: "translate(0px, 1335px)",
                                    }}
                                >
                                    <ul
                                        className='py-1 text-sm text-gray-700 dark:text-gray-200'
                                        aria-labelledby='dropdownDividerButton'
                                    >
                                        <li>
                                            <a
                                                href='#'
                                                className='block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                                            >
                                                Mới nhất
                                            </a>
                                        </li>

                                        <li>
                                            <a
                                                href='#'
                                                className='block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                                            >
                                                Thi nhiều
                                            </a>
                                        </li>
                                    </ul>
                                    <div className='py-1'>
                                        <a
                                            href='#'
                                            className='block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                                        >
                                            Xem nhiều
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {subject.tests &&
                                subject.tests.length &&
                                subject.tests.map(test => (
                                    <TestSummary test={test} key={test.id} />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestsPage;
