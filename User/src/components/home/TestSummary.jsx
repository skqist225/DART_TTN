import React from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonIcon from "@mui/icons-material/Person";
import HinhAnh from "../../images/trac-nghiem-dia-ly-du-lich-viet-nam-co-dap-an-phan-1_1.png.webp";
import { Link } from "react-router-dom";

function TestSummary() {
    return (
        <div>
            <div>
                <img src={HinhAnh} alt='' width={"348px"} height='232px' />
            </div>
            <div>
                <div
                    className='inline-flex h-8 items-center justify-center px-1.5 py-3 text-sm mr-5'
                    style={{
                        background: "rgba(255, 152, 0,0.18)",
                        borderRadius: "50px",
                        color: "#ec8d01",
                    }}
                >
                    Đại học
                </div>
            </div>
            <Link to={""}>
                <div
                    className='text-base overflow-hidden text-ellipsis h-12'
                    style={{
                        lineHeight: "25px",
                        "-webkit-line-clamp": 2,
                        display: "-webkit-box",
                        "-webkit-box-orient": "vertical",
                    }}
                >
                    Bộ Câu hỏi thi trắc nghiệm môn Hóa
                </div>
            </Link>
            <div className='flex items-center'>
                <div>
                    <span>
                        <AccessTimeIcon />
                    </span>
                    50 phút
                </div>
                <div>
                    <span>
                        <ChatBubbleOutlineIcon />
                    </span>
                    20 câu hỏi
                </div>
                <div>
                    <span>
                        <PersonIcon />
                    </span>
                    500 lượt thi
                </div>
            </div>
        </div>
    );
}

export default TestSummary;
