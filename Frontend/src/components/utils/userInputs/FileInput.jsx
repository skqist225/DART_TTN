import React, { useEffect } from "react";
import $ from "jquery";
import { tailwindCss } from "../../../tailwind";
import { CloseIcon } from "../../../images";
import { getImage } from "../../../helpers";

function FileInput({ setImage, image }) {
    useEffect(() => {
        if (image) {
            $("#imagePreview").attr("src", getImage(image));
        }
    }, [image]);

    const previewImage = event => {
        const image = event.target.files[0];
        const fileReader = new FileReader();

        $("#imagePreviewName").text(` : ${image.name}`);
        $("#removePreviewImage").css("display", "block");

        fileReader.onload = function (e) {
            $("#imagePreview").attr("src", e.target.result);
        };

        fileReader.readAsDataURL(image);
        setImage(image);
    };

    const removePreviewImage = () => {
        $("#imagePreview").attr("src", "");
        $("#imagePreviewName").text(``);
        $("#removePreviewImage").css("display", "none");
        setImage(null);
    };

    return (
        <>
            <div className='mt-3'>
                <label htmlFor='countries' className={tailwindCss.label}>
                    Hình ảnh <span id='imagePreviewName'></span>
                </label>
            </div>
            <div className='flex'>
                <div className='flex flex-initial justify-center items-center w-3/6 mr-5'>
                    <label htmlFor='dropzone-file' className={tailwindCss.dropZoneLabel}>
                        <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                            <svg
                                aria-hidden='true'
                                className='mb-3 w-10 h-10 text-gray-400'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                                ></path>
                            </svg>
                            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                                <span className='font-semibold'>Nhấn để chọn hình ảnh</span>
                                {/* hoặc kéo thả */}
                            </p>
                        </div>
                        <input
                            id='dropzone-file'
                            type='file'
                            accept='image/*'
                            className='hidden'
                            onChange={previewImage}
                            onClick={e => {
                                e.target.value = null;
                            }}
                        />
                    </label>
                </div>
                <div
                    className='flex flex-initial justify-center items-center w-3/6 rounded-lg border-2 border-gray-300 border-dashed overflow-hidden relative'
                    style={{ maxHeight: "119px" }}
                >
                    <img id='imagePreview' src='' alt='' className='object-contain' />

                    <button
                        id='removePreviewImage'
                        type='button'
                        className={`${tailwindCss.modal.closeButton} absolute top-0 right-0 hidden`}
                        onClick={removePreviewImage}
                    >
                        <CloseIcon />
                    </button>
                </div>
            </div>
        </>
    );
}

export default FileInput;
