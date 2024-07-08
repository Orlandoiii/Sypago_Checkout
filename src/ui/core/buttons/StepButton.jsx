function PrevIcon({ }) {
    return (
        <svg className="w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd">
            </path>
        </svg>
    )
}

function NextIcon({ }) {
    return (
        <svg className="w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd">
            </path>
        </svg>
    )
}


function NextButton({ children }) {
    return (
        <>

            {/* <div className="relative min-w-[90px]"> */}
            <p className=" absolute transition-all ease-in-out 
            duration-300 top-1/2 left-1/2 transform  -translate-x-1/2  -translate-y-1/2  text-sm group-hover:translate-x-0 group-hover:left-2">{children}</p>
            <div className="absolute transition-all ease-in-out duration-300 
            opacity-0 top-1/2 right-1/2 transform  -translate-x-1/2  -translate-y-1/2 group-hover:translate-x-0 group-hover:right-2 group-hover:opacity-100">
                <NextIcon />
            </div>

            {/* </div> */}

        </>
    )
}

function PrevButton({ children }) {
    return (
        <>
            <div className="absolute transition-all ease-in-out duration-300 
            opacity-0 top-1/2 left-1/2 transform  -translate-x-1/2  -translate-y-1/2 group-hover:translate-x-0 group-hover:left-2 group-hover:opacity-100">
                <PrevIcon />
            </div>
            <p className=" absolute transition-all ease-in-out 
            duration-300 top-1/2 right-0 transform  -translate-x-1/2  -translate-y-1/2  text-sm group-hover:translate-x-0 group-hover:right-2">{children}</p>
        </>
    )
}

export default function StepButton({ children, nextButton = true, onClick }) {
    return (

        <button type="button"
            onClick={(e) => { if (onClick) onClick(e) }}
            className={`group relative min-w-[100px] min-h-[40px] transition-all ease-in-out duration-300 
                 text-white block
                 ${nextButton ? "border-l rounded-r-md bg-primary hover:bg-secundary" :
                    " rounded-l-md border-r bg-rose-700 hover:bg-rose-900"} 
                border-gray-100   
                hover:text-white`} >

            {nextButton ?
                <NextButton>
                    {children}
                </NextButton> :
                <PrevButton>
                    {children}
                </PrevButton>}

        </button>
    )
}