import React, { useMemo } from "react"


function ChipOptions({ options, selectedOption, onSelectedOption }) {

    return useMemo(() => {
        const opt = options.length > 0
            ? options.map((o, i) => (
                <button
                    type="button"
                    key={i}
                    className={`rounded-full whitespace-nowrap  
                    px-[9px]  flex items-center justify-center text-sm  mr-3 
                    transition-colors duration-300 drop-shadow-xl 
                    shadow-slate-300 w-[100px] h-[30px]
                    ${o == selectedOption ? "bg-primary text-white" : "bg-gray-300 text-gray-500"}
                    `}

                    onClick={(e) => {
                        e.preventDefault;
                        const value = o.toString();

                        if (onSelectedOption)
                            onSelectedOption(value);

                    }}>
                    {o}
                </button>
            ))
            : null;

        return opt;
    }, [options])
}


function ChipSelector({ options = ["Teléfono", "Cuenta"], selectedOption = "Teléfono", onSelectedOption }) {


    return (
        <div className="h-full w-full flex">
            <ChipOptions options={options} onSelectedOption={(value) => {
                if (onSelectedOption)
                    onSelectedOption(value)
            }} selectedOption={selectedOption} />
        </div>
    )
}


export default ChipSelector