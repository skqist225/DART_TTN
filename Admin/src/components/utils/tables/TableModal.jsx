import React from "react";
import { CloseIcon } from "../../../images";
import { tailwindCss } from "../../../tailwind";
import $ from "jquery";

function TableModal({
    modalId,
    formId,
    handleSubmit,
    onSubmit,
    modalLabel,
    ModalBody,
    buttonLabel,
    setIsEdit,
}) {
    return (
        <div
            id={modalId}
            tabindex='-1'
            aria-hidden='true'
            className={tailwindCss.modal.container}
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
            <div className='relative w-full max-w-4xl h-full md:h-auto'>
                <form
                    id={formId}
                    onSubmit={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSubmit(onSubmit)(e);
                    }}
                    className='relative bg-white rounded-lg shadow dark:bg-gray-700'
                >
                    <div className={tailwindCss.modal.body}>
                        <h3 className={tailwindCss.modal.title}>{modalLabel}</h3>
                        <button
                            type='button'
                            className={tailwindCss.modal.closeButton}
                            data-modal-toggle={modalId}
                            onClick={() => {
                                $("#" + modalId).css("display", "none");
                                setIsEdit(false);
                            }}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className='p-6 space-y-6'>{ModalBody}</div>
                    <div className='flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600'>
                        <button type='submit' className={tailwindCss.modal.saveButton}>
                            {buttonLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TableModal;
