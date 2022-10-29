import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonIcon from "@mui/icons-material/Person";
import HinhAnh from "../../images/trac-nghiem-dia-ly-du-lich-viet-nam-co-dap-an-phan-1_1.png.webp";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Load from "../../images/load.svg";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function TestSummary({ test }) {
    console.log(test);
    return (
        <div className='flex-col rounded-lg h-52 bg-slate-50 mb-3'>
            <div className='flex-1 flex items-start p-2'>
                <div>
                    <img
                        src={HinhAnh}
                        alt=''
                        width={"180px"}
                        height='180px'
                        className='rounded-sm'
                    />
                </div>
                <div className='flex-1'>
                    <h4 className='text-base font-semibold'>{test.name}</h4>
                    <div className='flex items-center justify-between'>
                        <div>
                            <span>
                                <ChatBubbleOutlineIcon style={{ color: "#27b737" }} />
                            </span>
                            20 câu hỏi
                        </div>
                        <div>
                            <span>
                                <PersonIcon style={{ color: "#ffc107" }} />
                            </span>
                            500 lượt thi
                        </div>
                        <div>
                            <span>
                                <RemoveRedEyeIcon style={{ color: "#27b737" }} />
                            </span>
                            500 lượt thi
                        </div>
                    </div>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                            <img src={Load} alt='' width='20px' height='20px' />
                            30 người đang thi
                        </div>
                        <div>
                            <button
                                type='button'
                                className='text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2'
                                onClick={() => {
                                    window.location.href = `/take-test/${test.id}`;
                                }}
                            >
                                Thi ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className='w-full bg-orange-200' style={{ height: "6px" }}></div>
                <div className='flex items-center justify-between'>
                    <div>
                        <PlayArrowIcon style={{ color: "#27b737" }} />
                        Xem trước
                    </div>
                    <div>{test.time}</div>
                </div>
            </div>
        </div>
    );
}

export default TestSummary;
