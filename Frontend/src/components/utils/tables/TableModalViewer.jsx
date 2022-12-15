import $ from "jquery";
import React from "react";
import { CloseIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";

function TableModalViewer({ modalId, modalLabel, ModalBody }) {
    return (
        <div
            id={modalId}
            tabIndex='-1'
            aria-hidden='true'
            className={tailwindCss.modal.container}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div className='relative w-full max-w-4xl h-full md:h-full mt-24'>
                <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
                    <div className={tailwindCss.modal.body}>
                        <h3 className={tailwindCss.modal.title}>{modalLabel}</h3>
                        <button
                            type='button'
                            className={tailwindCss.modal.closeButton}
                            data-modal-toggle={modalId}
                            onClick={() => {
                                $(`#${modalId}`).css("display", "none");
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <div className='p-4 space-y-6'>{ModalBody}</div>
                </div>
            </div>
        </div>
    );
}

export default TableModalViewer;
