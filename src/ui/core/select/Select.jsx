import { useState, useEffect, useRef } from 'react'
import InputBox from '../input/InputBox';
import logger from '../../../logic/Logger/logger';
import { OptionSelectorButton, Options, OptionsContainer, OptionsMobile, OptionsSearchButton } from './SelectCommon';
import { isMobile } from 'react-device-detect';
import DraggableBox from '../drag_box/DraggableBox';

export default function Select({
    inputName,
    label,
    useDotLabel = false,
    value,
    type = "text",

    onSelected,
    onFocus,
    onMouseDown,

    register,
    setValue,
    controlled = false,
    options = [],
    openUp = false,
    wacth = null,

}) {

    logger.log("Renderizo Select")

    const [open, setOpen] = useState(false)

    const ref = useRef(null) // Ref for the main Select div

    const inputRef = useRef(null)


    const [searchMobileValue, setSearchMobileValue] = useState("");

    const [closeMobileOptions, setCloseMobileOptions] = useState(false);

    if (!value)
        value = "";


    if (options && options.length == 1) {
        value = options[0];
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


    function handleOnSelected(selectValue) {

        inputRef.current.value = selectValue;

        if (!controlled && register && selectValue !== '') {


            if (setValue)
                setValue(inputName, selectValue);
            return;
        }

        if (isMobile) {
            setCloseMobileOptions(true);
        }

        if (onSelected && selectValue !== '')
            onSelected(selectValue)



    }

    function handleOnFocus(e) {
        setOpen(true);
        if (onFocus)
            onFocus(e);
    }

    function handleOnClick(e) {
        e.stopPropagation()
        setOpen((o) => !o)
    }

    return (
        <div ref={ref} className="relative space-y-1 text-left bg-inherit w-full">

            <InputBox
                label={label}
                inputName={inputName}
                value={value}
                controlled={false}

                {...(register ? { register: register } : {})}
                turnOffAutoCompleted={true}
                type={type}
                onClick={handleOnClick}
                onMouseDown={onMouseDown}

                inputRef={inputRef}
                watch={wacth}
                readOnly={true}
                onFocus={handleOnFocus}
                useDotLabel={useDotLabel}
                icons={<OptionSelectorButton open={open} setOpen={setOpen} openUp={openUp} />}
            />

            {!isMobile && <OptionsContainer open={open} openUp={openUp}>
                <Options
                    options={options}
                    value={value}
                    setOpen={setOpen}
                    onSelected={handleOnSelected} />
            </OptionsContainer>
            }


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

        </div>
    )
}

