import React from 'react';

function CurrencyToggle({ isBs = true, setIsBs }) {

    const handleToggle = () => {
        if (setIsBs) {
            setIsBs(!isBs);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className="relative w-16 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out 
            focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white bg-primary">

            <div className={`absolute inset-0 rounded-full transition-colors 
                duration-300 ease-in-out`} />

            <div className={`absolute top-1 flex items-center justify-center w-6 h-6 
                    bg-white rounded-full shadow transform 
                    transition-transform duration-300 ease-in-out ${isBs ? 'translate-x-8' : 'translate-x-0'
                }`}
            />

            <div className="relative flex justify-between items-center h-full font-semibold  px-[0.350rem]">
                <span className="text-white text-sm">Bs</span>
                <span className="text-white text-md">$</span>
            </div>

        </button>
    );
}

export default CurrencyToggle;