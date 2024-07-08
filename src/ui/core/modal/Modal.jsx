import React from 'react';
import Backdrop from './Backdrop';
import { motion, AnimatePresence } from 'framer-motion';

function CloseXSimbol({ onClose }) {
    return (
        <button className='w-6 bg-slate-100 rounded-full p-[0.28rem] 
        absolute top-1 right-1.5 shadow-md swadow-slate-500 z-10' onClick={(e) => {
                e.stopPropagation();
                if (onClose) onClose(e);
            }}>
            <div className="flex w-full justify-end">
                <div className="fill-secundary w-8">

                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.7 20.1C5.20294 20.5971 4.39706 20.5971 3.9 20.1C3.40294 19.6029 3.40294 18.7971 3.9 18.3L10.2 12L3.9 5.7C3.40294 5.20294 3.40294 4.39706 3.9 3.9C4.39706 3.40294 5.20294 3.40294 5.7 3.9L12 10.2L18.3 3.9C18.7971 3.40294 19.6029 3.40294 20.1 3.9C20.5971 4.39706 20.5971 5.20294 20.1 5.7L13.8 12L20.1 18.3C20.5971 18.7971 20.5971 19.6029 20.1 20.1C19.6029 20.5971 18.7971 20.5971 18.3 20.1L12 13.8L5.7 20.1Z" fill="#0065BB">
                        </path>
                    </svg>
                </div>
            </div>
        </button>
    )
}


function Modal({ children, open, showX, onClose }) {
    return (
        <AnimatePresence
            initial={false}
            // mode='wait'
            onExitComplete={() => null}
        >
            {open && <Backdrop>
                <motion.div
                    initial={{
                        scale: 1.5,
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        scale: 1.2
                    }}
                    transition={{ ease: "easeInOut" }}
                    className="relative  w-[375px] md:w-full md:max-w-[450px]  
                    min-h-[320px] rounded-xl bg-white shadow-lg shadow-gray-400">
                    {showX && <CloseXSimbol onClose={onClose} />}
                    <div className={`w-full`}>
                        {children}
                    </div>
                </motion.div>
            </Backdrop>}
        </AnimatePresence>
    );
}

export default Modal;