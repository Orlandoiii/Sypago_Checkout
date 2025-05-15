import { useState } from "react";


const emptyRegister = {
    onChange: null,
    onBlur: null,
    name: "",
    ref: null,
}

export function FormatAsFloat(value) {


    if (value != null && value !== '') {


        let numString = value;

        if (typeof value === "string") {
            numString = parseFloat(value.replaceAll(".", "").replaceAll(",", "."));
        }

        let number = new Intl.NumberFormat('es-VE').format(
            numString
        )


        const hasCommaQuestion = number.indexOf(",") !== -1;

        if (!hasCommaQuestion) number = `${number},00`;

        if (number.split(",")[1].length < 2)
            number = number + "0";


        return number;
    }

    return '0,00'


}

export function ParseToFloat(value) {

    if (!value)
        return 0;

    const commas = value.split(',').length;
    const dots = value.split('.').length;

    if (commas > 1 && dots > 1) {
        if (value.lastIndexOf(',') > value.lastIndexOf('.'))
            value = value.replaceAll('.', '');
        else value = value.replaceAll(',', '');

    } else if (commas > 2)
        value = value.replaceAll(',', '');

    else if (dots > 2)
        value = value.replaceAll('.', '');

    value = value.replaceAll(',', '.');


    if (value.split('.').length > 1) {

        if (value.split('.')[1].length > 2) {


            return parseFloat(value) * 10;
        }

        else if (value.split('.')[1].length < 2) {

            return parseFloat(value) / 10;
        }


        return parseFloat(value);
    }

    return parseFloat(value) / 100;
}


function isValidInputCharacter(key, regexPattern) {
    // Allow functional keys
    const functionalKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Tab"

    ];

    if (functionalKeys.includes(key.code)) {
        return true;
    }

    if (key.keyCode === 13 || key.keyCode === 46 || key.keyCode === 8) {
        return true;
    }

    const regex = new RegExp(regexPattern);
    return regex.test(key.key); // Return true if matches regex, false otherwise
}

function Label({ inputName, label, useDotLabel, isFocus, value }) {
    return (
        <label className={`h-full absolute left-[0.360rem] top-0 flex items-center select-none px-3 
             transition-all ease-in-out duration-300 font-medium   bg-transparent origin-left text-md
        ${isFocus || (value && value?.toString().length > 0) ?
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
    customType = "",
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
    characterValidationPattern = null,

}) {




    if (!inputName)
        inputName = label;

    const [isFocus, setIsFocus] = useState(false);

    const { onChange, onBlur, ref } = register != null && !controlled ?
        register(inputName, validationRules ?? {}) : emptyRegister;


    const defaultValue = value;


    if (watch && !controlled) {

        value = watch(inputName);
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

        if (characterValidationPattern && characterValidationPattern != "") {

            if (!isValidInputCharacter(e, characterValidationPattern)) {
                e.preventDefault();
                return;
            }
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
                        rounded-md shadow-sm outline-none text-slate-800 font-medium border bg-main-bg-secundary 
                       ${errMessage && errMessage.length > 0 ?
                            (!useStrongErrColor ? "border-gray-600" : "border-error") :
                            (isFocus ? "border-focus" : "border-slate-300")} 
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
                        (!useStrongErrColor ? "border-gray-600" : "border-error") : "border-focus"} 
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

