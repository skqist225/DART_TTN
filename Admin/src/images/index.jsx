export const SortableIcon = () => (
    <svg
        xmlns='http://www.w3.org/2000/svg'
        className='ml-1 w-3 h-3'
        ariaHidden='true'
        fill='currentColor'
        viewBox='0 0 320 512'
    >
        <path d='M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z' />
    </svg>
);

export const CloseIcon = () => (
    <svg
        className='w-5 h-5'
        fill='currentColor'
        viewBox='0 0 20 20'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
        ></path>
    </svg>
);

export const EmailIcon = () => {
    return (
        <svg
            aria-hidden='true'
            className='w-5 h-5 text-gray-500 dark:text-gray-400'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
            <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
        </svg>
    );
};

export const ExcelIcon = () => {
    return (
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='24px' height='24px'>
            <path fill='#169154' d='M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z' />
            <path fill='#18482a' d='M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z' />
            <path fill='#0c8045' d='M14 15.003H29V24.005000000000003H14z' />
            <path fill='#17472a' d='M14 24.005H29V33.055H14z' />
            <g>
                <path fill='#29c27f' d='M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z' />
                <path
                    fill='#27663f'
                    d='M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z'
                />
                <path fill='#19ac65' d='M29 15.003H44V24.005000000000003H29z' />
                <path fill='#129652' d='M29 24.005H44V33.055H29z' />
            </g>
            <path
                fill='#0c7238'
                d='M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z'
            />
            <path
                fill='#fff'
                d='M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z'
            />
        </svg>
    );
};
