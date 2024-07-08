import React, { useRef, useState, useEffect } from "react";
// import { InputHelpersFunctions, ValidateKey } from "../core/inputs/ShareLogic"


function extractNumbers(text) {
    return text.match(/\d+/g)?.join('');
}

function getInputDataIndex(event) {
    return event?.target?.dataset?.index
}


function OnKeyDownHanlder(type, event, max) {
    //ValidateKey(type, event, max);
}

function OnPasteHandler(event, otpLen, inputRefs) {

    const clipboardData = event.clipboardData;

    const pastedText = clipboardData.getData('text/plain');

    const numberText = extractNumbers(pastedText);

    const inputIndex = getInputDataIndex(event);

    let counter = inputIndex;

    if (numberText && numberText != '') {

        let numberTextCounter = 0;

        while (counter < otpLen && numberText[numberTextCounter]) {
            inputRefs.current[counter].current.value = numberText[numberTextCounter];
            counter++;
            numberTextCounter++;
        }

    }

    if (counter == otpLen) {
        counter--;
    }

    inputRefs.current[counter].current.focus();

    event.preventDefault();
}

function preventGoFuther(e, inputRefs) {
    const inputIndex = getInputDataIndex(e);
    for (let i = 0; i <= inputIndex; i++) {
        if (!inputRefs.current[i].current.value || inputRefs.current[i].current.value == '') {
            inputRefs.current[i].current.focus();
            break;
        }
    }
}

function getOtpComplete(inputRefs, otpLen) {
    let otpValues = new Array();
    for (let i = 0; i < otpLen; i++) {
        otpValues.push(inputRefs.current[i].current.value)
    }
    let otpString = otpValues.join('');
    return otpString;
}


function OtpInputs({ totalInputs, onChageOtpEvent }) {

    const inputs = new Array();

    const inputRefs = useRef(new Array());



    for (let i = 0; i < totalInputs; i++) {

        const inputRef = useRef({})


        const otp = <input key={i} id={`input-OTP-digit-${i}`} inputMode="numeric" type="text"
            className="border-slate focus:border-b-secundary h-10 w-8 border border-b-2  
      border-b-slate-400 text-center text-lg focus:outline-none" data-index={i} maxLength={1} ref={inputRef} />

        inputs.push(otp);

        inputRefs.current.push(inputRef);
    }

    useEffect(() => {
        inputRefs.current[0].current.focus();
    }, [])

    return (
        <div className="flex w-full justify-center space-x-2" id="digits-inputs-container"
            onKeyDownCapture={(e) => {
                OnKeyDownHanlder("Integer", e, 1);
                if (e.key === 'Backspace') {
                    const inputIndex = getInputDataIndex(e);
                    if (inputRefs.current[inputIndex].current.value == '' && inputIndex > 0) {
                        inputRefs.current[inputIndex - 1].current.focus();
                    }
                }
                e.stopPropagation();
            }}
            onClickCapture={(e) => {
                preventGoFuther(e, inputRefs);
                e.stopPropagation();
            }}
            onFocusCapture={(e) => {
                preventGoFuther(e, inputRefs);
                e.stopPropagation();
            }}

            onPasteCapture={(e) => {
                OnPasteHandler(e, inputs.length, inputRefs);
                if (onChageOtpEvent) {

                    onChageOtpEvent(getOtpComplete(inputRefs, inputs.length));
                }
                e.stopPropagation();
            }}
            onChangeCapture={(e) => {

                if (e.target.value && e.target.value != '') {

                    const currentIndex = parseInt(getInputDataIndex(e), 10);

                    if (currentIndex + 1 < totalInputs) {
                        inputRefs.current[currentIndex + 1].current.focus();
                    }
                }

                if (onChageOtpEvent) {

                    onChageOtpEvent(getOtpComplete(inputRefs, inputs.length));
                }

                e.stopPropagation();

            }}>
            {inputs}

        </div>

    )
}




function OtpForm({ otpLen, timerTime, onSubmitOtpEvent, transactionData = null, signalRClient = null }) {

    const [otpValue, setOtpValue] = useState('');

    const [secondsRemaining, setSecondsRemaining] = useState(timerTime);

    const timerID = useRef(null);

    function isValidOtp() {
        return otpValue.length >= 6;
    }


    const startTimer = () => {
        timerID.current = setInterval(() => {
            setSecondsRemaining(prevSeconds => {

                return prevSeconds - 1;
            });

        }, 1000);
    }

    const stopTimer = () => {
        if (timerID.current)
            clearInterval(timerID.current);
    }


    function resetOtpForm() {
        setSecondsRemaining(timerTime);
        stopTimer();
        // Other resets if needed (OTP input, etc.)
    };



    // useEffect(() => {

    //     RequestOtp(transactionData, signalRClient).then((result) => {
    //         console.log(result);
    //     }).catch((err => { console.log(err) }))


    //     startTimer();

    //     return () => {
    //         resetOtpForm();
    //     };


    // }, [])

    return (
       
       
       <div className="flex flex-col [&>*]:mb-2 py-8 px-4">

            <div className="h-14 w-14 mx-auto">
                <svg className="w-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1289_9760)">
                        <path d="M9.49091e-05 29.8454C-0.00904095 14.7684 11.8173 0.174549 30.0296 0.00130216C46.6432 -0.153709 60.0546 13.5511 59.9998 30.2466C59.9496 45.3693 48.0547 59.9038 29.8835 59.9996C13.2791 60.0862 -0.0410164 46.4589 9.49091e-05 29.8454ZM30.0936 3.63038C15.4168 3.6167 3.5311 15.3337 3.47172 29.8637C3.4169 44.4347 15.2524 56.3477 29.815 56.3751C44.5922 56.4024 56.4962 44.6672 56.5191 30.0552C56.5419 15.4978 44.6881 3.64406 30.0936 3.63038Z" fill="#0065BB"></path>
                        <g clipPath="url(#clip1_1289_9760)">
                            <path d="M44.417 26.9187H41.0136C41.0136 26.2645 41.0136 25.6278 41.0136 24.9911C41.0124 24.1561 40.7789 23.9137 39.9743 23.9137C32.805 23.9137 25.6369 23.9137 18.4676 23.9137C17.6282 23.9137 17.3824 24.1586 17.3861 25.005C17.3936 27.1071 17.4085 29.2092 17.4172 31.3114C17.4172 31.452 17.4023 31.5926 17.3923 31.7333C17.3414 32.4604 17.6506 32.7806 18.3633 32.7781C20.3425 32.7731 22.3229 32.7831 24.3021 32.7806C25.9436 32.7781 27.5851 32.7605 29.2266 32.7555C30.6495 32.7517 32.0724 32.7555 33.5413 32.7555V35.6789C33.3886 35.6864 33.2247 35.7002 33.0608 35.7002C27.893 35.7002 22.7265 35.7027 17.5587 35.7002C15.4516 35.699 14.0125 34.2548 14.0063 32.1314C13.9989 29.6048 13.9989 27.0782 14.0063 24.5516C14.0138 22.4583 15.4615 21.0029 17.5314 21.0029C25.3215 21.0003 33.1105 21.0003 40.9006 21.0029C42.9307 21.0029 44.3897 22.4708 44.4158 24.5265C44.4257 25.3076 44.417 26.0899 44.417 26.9187Z" fill="#0065BB"></path>
                            <path d="M44.5411 34.8095C45.9441 35.0531 46 35.1222 46 36.555C46 38.1071 46.0025 39.6605 45.9988 41.2126C45.9975 41.8531 45.856 41.9975 45.2376 41.9975C42.0739 42 38.9114 42 35.7476 41.9975C35.1355 41.9975 34.984 41.8418 34.984 41.2164C34.9815 39.5387 34.984 37.861 34.984 36.1821C34.984 35.2038 35.2448 34.9251 36.2021 34.8673C36.2629 34.8635 36.3225 34.8459 36.4541 34.8233C36.4541 34.0649 36.4752 33.3014 36.4504 32.5391C36.3784 30.3868 37.9714 28.7894 39.6713 28.4454C41.6157 28.0511 43.4993 29.0695 44.248 30.9732C44.438 31.4554 44.5001 32.0067 44.5324 32.5316C44.5783 33.2926 44.5448 34.0586 44.5448 34.8108L44.5411 34.8095ZM42.1298 34.8409C42.1298 33.9041 42.1682 33.0251 42.1161 32.1524C42.0838 31.6086 41.7361 31.1653 41.2556 30.9456C39.9444 30.3466 38.7326 31.2608 38.8592 32.7137C38.8741 32.8845 38.8567 33.0578 38.8567 33.2298C38.8567 33.7572 38.8567 34.2846 38.8567 34.8422H42.1322L42.1298 34.8409Z" fill="#0065BB"></path>
                            <path d="M22.6232 31.2644C21.2003 31.3448 19.8593 30.0639 19.7848 28.5558C19.7029 26.8919 20.8775 25.5306 22.473 25.4402C24.0809 25.3498 25.4517 26.5805 25.5411 28.1891C25.6293 29.7864 24.4013 31.2883 22.6245 31.2644H22.6232Z" fill="#0065BB"></path>
                            <path d="M27.606 28.3282C27.6134 26.7209 28.8886 25.4388 30.4779 25.4375C32.0809 25.4375 33.3946 26.7447 33.3673 28.3622C33.3387 30.0373 32.1331 31.229 30.5077 31.278C28.8675 31.3282 27.5985 29.9758 27.606 28.3282Z" fill="#0065BB"></path>
                        </g>
                    </g>
                    <defs>
                        <clipPath id="clip0_1289_9760"><rect width="60" height="60" fill="white"></rect></clipPath>
                        <clipPath id="clip1_1289_9760"><rect width="32" height="21" fill="white" transform="translate(14 21)"></rect></clipPath>
                    </defs>
                </svg>
            </div>

            <div className="px-3 py-2">
                <h3 className="text-md text-slate-600 text-center">Ingrese el código de verificación
                    <br /> enviado a su cuenta de <br />correo electrónico o buzón de mensaje.
                </h3>
            </div>

            <div className="w-full py-3">
                <OtpInputs onChageOtpEvent={(otp) => { setOtpValue(otp) }} totalInputs={otpLen}></OtpInputs>
            </div>

            <button type="button" id=""
                className={`rounded p-4 text-white  
              ${isValidOtp() ? "bg-[#0065BB]" : "bg-gray-500"}`} disabled={!isValidOtp()}
                onClick={(e) => {
                    if (onSubmitOtpEvent)
                        onSubmitOtpEvent(e, otpValue);
                }}
            >
                Confirmar
            </button>
            {secondsRemaining < 0 ?
                <a className="text-secundary cursor-pointer text-center text-md underline-offset-4 font-normal mt-2" aria-disabled=""
                    onClick={(e) => {
                       
                        resetOtpForm();
                        startTimer();

                    }}>Solicitar token nuevamente</a>
                : <p className="text-gray-500 cursor-pointer text-center text-md underline-offset-4 font-normal mt-2">Espere antes de solicitar {secondsRemaining} seg</p>}

        </div>
    )
}

export default OtpForm;