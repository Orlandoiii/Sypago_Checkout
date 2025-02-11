import { useState, useEffect, useRef } from 'react';
import { OptionSelectorButton, Options, OptionsContainer, OptionsMobile, OptionsSearchButton } from './SelectCommon';
import InputBox from '../input/InputBox';
import { isMobile } from 'react-device-detect';
import DraggableBox from '../drag_box/DraggableBox';


export default function SelectWithSearch({
    label,
    inputName,
    value,
    type = 'text',
    options = [],
    onChange,
    onChangeRaw,
    useDotLabel = false,
    useStrongErrColor = false,
    onError,
    openUp = false,
    disabled = false,
    wacth = null,
    characterValidationPattern,
    description = null
}) {
    const [open, setOpen] = useState(false)

    const ref = useRef(null) // Ref for the main Select div

    const inputRef = useRef(null)

    const [isTouch, setIsTouch] = useState(false)

    const [errMessage, setErrMessage] = useState("");


    const [searchMobileValue, setSearchMobileValue] = useState("");

    const [closeMobileOptions, setCloseMobileOptions] = useState(false);


    if (!value)
        value = "";



    let readonly = false;

    if (options && options.length == 1) {
        readonly = true;
        value = options[0];
    }


    if (isMobile) {
        readonly = true;

    }


    useEffect(() => {

        if (isMobile)
            return;

        const handleClickOutside = (event) => {
            if (open && ref?.current && !ref.current.contains(event.target)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open, setOpen])


    useEffect(() => {
        if ((isTouch || useStrongErrColor) && options.indexOf(value) === -1) {
            setErrMessage("Debe eligir una opción válida");
            if (onError)
                onError(true);
            return;
        }


        if (onError)
            onError(false);
        setErrMessage("");

    }, [errMessage, isTouch, value, useStrongErrColor])

    function handleOnChange(e) {
        if (!isTouch)
            setIsTouch(true);

        if (onChange) onChange(e.target.value)
        if (onChangeRaw) onChangeRaw(e)
    }

    function handleOnSelected(selectValue) {

        if (!isTouch)
            setIsTouch(true);

        if (onChange)
            onChange(selectValue)
        inputRef.current?.blur();

        if (isMobile) {
            setCloseMobileOptions(true);
        }
    }

    function handleOnFocus(e) {

        if (!isTouch)
            setIsTouch(true);

        setOpen(true)

        if (isMobile)
            return;

        if (onChange) onChange('')
    }




    function handleOnClick(e) {


        if (!isTouch)
            setIsTouch(true);

        //e.stopPropagation();
        // if (readonly)
        //     return;

        setOpen((o) => !o)
    }





    return (
        <div ref={ref} className="relative space-y-1 text-left bg-inherit w-full">

            <InputBox
                inputName={inputName}
                label={label}
                value={value}
                type={type}
                onClick={handleOnClick}
                onMouseDown={handleOnClick}
                onChangeEvent={handleOnChange}

                readOnly={readonly}
                controlled={true}
                onFocus={handleOnFocus}
                useDotLabel={useDotLabel}
                errMessage={errMessage}
                turnOffAutoCompleted={true}
                description={description}
                watch={wacth}
                useStrongErrColor={useStrongErrColor}
                inputRef={inputRef}
                characterValidationPattern={characterValidationPattern}
                icons={<OptionSelectorButton open={open} setOpen={(o) => {


                    setOpen(o);
                    if (disabled && readonly)
                        return;

                    if (isMobile)
                        setSearchMobileValue("");
                }}
                />}
            />

            {!isMobile && <OptionsContainer open={open} openUp={openUp} bottomSeparation='bottom-20'>
                <Options
                    options={options}
                    value={value}
                    setOpen={setOpen}
                    onSelected={handleOnSelected}
                    autoCompleted={true}
                />
            </OptionsContainer>}

            {isMobile && open &&
                <DraggableBox
                    closeFromInside={closeMobileOptions}
                    open={open}
                    onClose={() => {
                        inputRef.current?.blur();
                        setOpen(false)
                        setCloseMobileOptions(false);
                        setSearchMobileValue("");

                    }}

                    topStickyChild={
                        <OptionsSearchButton value={searchMobileValue}
                            onChange={(e) => { setSearchMobileValue(e.target.value) }} />
                    }
                >

                    <div className="h-full">
                        <OptionsMobile searchValue={searchMobileValue}
                            options={options} value={value} onSelected={handleOnSelected} />
                    </div>


                </DraggableBox>
            }


        </div >
    )
}
