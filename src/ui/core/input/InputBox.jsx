import { useState } from "react";
import logger from "../../../logic/Logger/logger";
import { ValidateCharacterOnKeyDown } from "../../../logic/InputsCommonLogic/Patterns";


const emptyRegister = {
    onChange: null,
    onBlur: null,
    name: "",
    ref: null,
}


// const floatLabeStyles = `h-full absolute left-1.5 top-0 flex items-center select-none px-3.5 
// transition-all ease-in-out duration-200  text-gray-600 bg-transparent origin-left text-md`

// const normalLabelStyles = "`block text-md pl-0.5 font-medium"


function Label({ inputName, label, useDotLabel, isFocus, value }) {
    return (
        <label className={`h-full absolute left-[0.360rem] top-0 flex items-center select-none px-3 
             transition-all ease-in-out duration-300 font-medium   bg-transparent origin-left text-md
        ${isFocus || (value && value.length > 0) ?
                "text-slate-600 scale-75   -translate-y-3" : "text-slate-700   scale-100  translate-y-0 "}`}
            htmlFor={inputName}>
            {`${useDotLabel ? label + ":" : label}`}
        </label>
    )
}

export default function InputBox({

    inputName,
    label,
    useDotLabel = false,
    value,
    type = "text",
    inputMode = "text",
    readOnly = false,

    errMessage = '',
    useStrongErrColor = false,

    onChangeEvent,
    onFocus,
    onMouseDown,
    onKeyDown,

    register,
    watch = null,
    validationRules,

    inputRef = null,
    controlled = false,
    turnOffAutoCompleted = false,

    icons = null,
    characterValidationPattern = null

}) {


    logger.log("Renderizo InputBox:", errMessage)


    if (!inputName)
        inputName = label;

    const [isFocus, setIsFocus] = useState(false);


    const { onChange, onBlur, ref } = register != null && !controlled ?
        register(inputName, validationRules ?? {}) : emptyRegister;


    const defaultValue = value;

    let isWachtWithDefault = false

    if (watch && !controlled) {

        value = watch(inputName);
        isWachtWithDefault = true;
    }

    function handleOnChange(e) {
        if (register) {

            onChange(e);
            return;
        }

        if (onChangeEvent) {
            onChangeEvent(e)
        }

    }

    function handleOnBlur(e) {


        if (!readOnly)
            setIsFocus(false);

        if (onBlur) {
            onBlur(e)
        }
    }

    function handleOnFocus(e) {

        if (!readOnly)
            setIsFocus(true);

        if (onFocus) {
            onFocus(e);
        }
    }

    function handleKeyDown(e) {

        if (characterValidationPattern) {
            if (!ValidateCharacterOnKeyDown(e, characterValidationPattern))
                return;
        }

        if (onKeyDown)
            onKeyDown(e);
    }




    return (
        <div className="w-full h-auto">

            <div className={`relative w-full h-[48px]  md:h-[55px]   shadow-sm`}>

                <Label isFocus={isFocus} value={value}
                    inputName={inputName} label={label} useDotLabel={useDotLabel} />

                <input
                    className={`peer h-full w-full pt-2 px-4  
                        rounded-md shadow-sm outline-none text-slate-800 font-medium border bg-white 
                       ${errMessage && errMessage.length > 0 ?
                            (!useStrongErrColor ? "border-gray-600" : "border-rose-700") :
                            (isFocus ? "border-blue-500" : "border-slate-300")} 
                          `}

                    ref={e => {
                        if (ref)
                            ref(e);
                        if (inputRef)
                            inputRef.current = e;
                    }}

                    id={inputName}
                    type={type}
                    inputMode={inputMode}

                    {...(!controlled ? { defaultValue: defaultValue } : { value: value })}

                    {...(turnOffAutoCompleted ? { autoComplete: "off" } : {})}

                    name={inputName}
                    placeholder={""}
                    readOnly={readOnly}

                    onKeyDown={handleKeyDown}

                    onChange={handleOnChange}
                    onFocus={handleOnFocus}
                    onMouseDown={onMouseDown}
                    onBlur={handleOnBlur} />


                <div className={`pointer-events-none absolute left-0 bottom-0 h-full w-full rounded-md border-b-4 opacity-0 
                  transition-colors duration-200  
                  ${errMessage && errMessage.length > 0 ?
                        (!useStrongErrColor ? "border-gray-600" : "border-rose-700") : "border-blue-500"} 
                   peer-hover:opacity-100 peer-focus:opacity-100 
                 peer-disabled/input:border-gray-300 `}></div>


                {icons}
                <span

                    className={`h-full w-full text-ellipsis overflow-x-hidden whitespace-nowrap  
                         pointer-events-none absolute left-0 top-[101%]   text-xs 
                         select-none  px-2.5
                         font-semibold transition-all ease-in-out duration-300
                          ${errMessage && errMessage.length > 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"}
                          ${!useStrongErrColor ? "text-gray-600" : "text-rose-700"}
                         `}>{errMessage}
                </span>

            </div>
        </div>

    )
}

