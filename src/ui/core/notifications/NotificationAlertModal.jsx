

import { AnimatePresence, motion } from 'framer-motion';
import React, { createContext, useContext, useState } from 'react';
import Backdrop from '../modal/Backdrop';

function SuccessIcon({ }) {
    return (
        <div className="relative mt-2 flex justify-center">

            <div className="absolute z-10 h-14 w-14 animate-ping rounded-full bg-emerald-400" ></div>
            <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500">
                <svg className="w-6 fill-neutral-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z">
                    </path>
                </svg>
            </div>
        </div>
    )
}


function FailureIcon({ }) {
    return (

        <div className="relative mt-2 flex justify-center">
            <div className="absolute z-10 h-20 w-20 animate-ping rounded-full bg-rose-500" ></div>
            <div className="z-10 flex h-[65px] w-[65px] items-center justify-center rounded-full bg-rose-600">
                <svg className="w-6" fill="white" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 460.775 460.775" xmlSpace="preserve">
                    <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
	c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
	c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
	c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
	l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
	c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                </svg>
            </div>
        </div>
    )
}


function InfoIcon({ }) {
    return (
        <div className="relative mt-2 flex justify-center">
            <div className="absolute z-10 h-14 w-14 animate-ping rounded-full bg-sky-500"></div>
            <div className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600">
                <svg className="w-8" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 7C12.8284 7 13.5 6.32843 13.5 5.5C13.5 4.67157 12.8284 4 12 4C11.1716 4 10.5 4.67157 10.5 5.5C10.5 6.32843 11.1716 7 12 7ZM11 9C10.4477 9 10 9.44772 10 10C10 10.5523 10.4477 11 11 11V19C11 19.5523 11.4477 20 12 20C12.5523 20 13 19.5523 13 19V10C13 9.44772 12.5523 9 12 9H11Z" fill="white" />
                </svg>
            </div>
        </div>
    )
}




function NotificationAlertModal({ open, onClick, type, message }) {
    let icon = <></>;
    let title = "";
    switch (type) {
        case "info":
            icon = <InfoIcon />;
            title = "Importante!!!"
            break;
        case "success":
            icon = <SuccessIcon />;
            title = "Excelente!!!"
            break;
        case "error":
            icon = <FailureIcon />;
            title = "Oohh Error!!!"
            break;

    }



    return (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}
        >
            {open &&
                <Backdrop>
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 1.5
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 1.2
                        }}
                        transition={
                            { ease: "easeInOut" }
                        }
                        className="bg-main-bg-secundary  relative flex flex-col  z-50 justify-between
                        px-3 py-8 min-w-[360px] min-h-[340px]  rounded-md shadow-md space-y-6 max-w-[370px]">
                        <div>
                            {icon}
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-3xl text-slate-700 font-medium ">{title}</h3>
                            <p className="text-lg text-slate-900">{message}</p>
                        </div>

                        <div className='w-full flex justify-center'>
                            <button
                                type="button"
                                className="text-center p-2 bg-primary  text-[whitesmoke] mb-[20px]  
                text-sm rounded-2xl  uppercase w-[100px] h-[40px] font-light "
                                onClick={onClick}
                            >Ok</button>
                        </div>

                    </motion.div>
                </Backdrop>}
        </AnimatePresence>
    );
}

const NotificationAlertModalContext = createContext({
    openAlertNotification: (type, message) => { },
    closeAlertNotification: () => { }
});

export function useNotificationAlert() {
    return useContext(NotificationAlertModalContext);
}


export default function NotificationAlertModalContextProvider({ children }) {

    const [open, setOpen] = useState(false);

    const [type, setType] = useState("info");

    // const [title, setTitle] = useState("");

    const [message, setMessage] = useState("");

    function openAlertNotification(type, message) {

        setType(type);

        setMessage(message);
        setOpen(true);

    }

    function closeAlertNotification() {
        setType("");
        ;
        setMessage("");
        setOpen(false);
    }

    return (
        <NotificationAlertModalContext.Provider value={{
            openAlertNotification: openAlertNotification,
            closeAlertNotification: closeAlertNotification

        }}>
            {children}
            <NotificationAlertModal open={open} onClick={() => { setOpen(false) }}
                type={type} message={message} />
        </NotificationAlertModalContext.Provider>
    )
}
