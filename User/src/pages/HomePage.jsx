import React from "react";
import Banner from "../images/banner-1.png";
import $ from "jquery";
import CalendarIcon from "../images/icons8-calendar-48.png";

function HomePage() {
    return (
        <div>
            <div className='max-w-7xl m-auto	'>
                <div>
                    <div
                        style={{
                            background: `#f7f8f9 url(${Banner}) no-repeat`,
                            backgroundPosition: "bottom",
                        }}
                        className='relative'
                    >
                        <div className='col-flex items-center align-middle'>
                            <h1 className='mb-4 text-5xl leading-tight'>
                                <span style={{ color: "#f26c4f" }}>TRẮC NGHIỆM ONLINE</span> - Kiểm
                                Tra Kiến Thức Hiệu Quả
                            </h1>
                            <p className='mb-4 leading-relaxed	'>
                                Hệ thống các câu hỏi trắc nghiệm các lĩnh vực giáo dục và hướng
                                nghiệp , kỹ năng mềm ...
                            </p>
                            <div className='max-w-7xl'>
                                <form class='flex items-center'>
                                    <label for='simple-search' class='sr-only'>
                                        Search
                                    </label>
                                    <div class='relative w-full'>
                                        <div class='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                                            <svg
                                                aria-hidden='true'
                                                class='w-5 h-5 text-gray-500 dark:text-gray-400'
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
                                            class='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                            placeholder='Search'
                                            required
                                        />
                                    </div>
                                    <button
                                        type='submit'
                                        class='p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                                    >
                                        <svg
                                            class='w-5 h-5'
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
                                        <span class='sr-only'>Search</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className='w-full flex items-center absolute justify-evenly -bottom-10'>
                            <div className='w-96 h-24 bg-white rounded-lg py-4 px-2.5 border-slate-300 border-2 border-solid'>
                                <div className='flex items-center'>
                                    <div>
                                        <div
                                            className='w-12	h-12 flex items-center justify-center rounded-full mr-2.5'
                                            style={{
                                                background: "rgba(255, 87, 34, 0.11)",
                                                border: "1px dashed",
                                                color: "#ff5722",
                                            }}
                                        >
                                            <img
                                                src={CalendarIcon}
                                                alt=''
                                                width='20px'
                                                height='20px'
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h3
                                            style={{ color: "#37455f " }}
                                            className='text-lg font-semibold'
                                        >
                                            5000+ Bài Thi
                                        </h3>
                                        <p style={{ color: "#3c4852 " }} className='text-sm'>
                                            Hơn 5000 bài thi với đầy đủ đáp án kèm lời giải chi tiết
                                            đi kèm .
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='w-96 h-24 bg-red-200 rounded-lg	py-4 px-2.5	'>2</div>
                            <div className='w-96 h-24 bg-red-200 rounded-lg	py-4 px-2.5	'>3</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
