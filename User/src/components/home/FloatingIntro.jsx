import React from "react";

function FloatingIntro({ Icon }) {
    return (
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
                        <img src={Icon} alt='' width='20px' height='20px' />
                    </div>
                </div>

                <div>
                    <h3 style={{ color: "#37455f " }} className='text-lg font-semibold'>
                        5000+ Bài Thi
                    </h3>
                    <p style={{ color: "#3c4852 " }} className='text-sm'>
                        Hơn 5000 bài thi với đầy đủ đáp án kèm lời giải chi tiết đi kèm .
                    </p>
                </div>
            </div>
        </div>
    );
}

export default FloatingIntro;
