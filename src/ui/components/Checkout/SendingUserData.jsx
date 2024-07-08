import React from 'react';
import imagePath from "../../../assets/back_arrow_blue.png"


function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        console.log(e)
        return false;
    }
}



function SendingUserData(
    {
        userName = '',
        userDocument = '',
        concept = '',
        monto = '',
        backUrl = null
    }
) {






    return (


        <div className="relative  h-full w-full flex flex-col justify-center items-center bg-transparent 
        text-[whitesmoke] p-4  ">

            {backUrl && isValidURL(backUrl) && <button
                className="absolute top-8 left-6  bg-white rounded-xl flex justify-center 
                items-center self-start p-1 md:top-[3.5rem] md:left-[3rem] md:p-3 md:px-4"

            >
                <img src={imagePath} alt="back_arrow" className="w-[30px] h-[30px]"></img>
                <p className="text-[#0B416E] text-md font-semibold hidden md:block">Regresar</p>
            </button>}

            <div className='flex flex-col justify-between items-center  
            p-4 [&>*]:my-[0.65rem]  md:[&>*]:my-[1.4rem]'>

                <div className="flex flex-col items-center">
                    <h1 className="text-2xl font-bold md:text-4xl">
                        {userName}
                    </h1>
                    <h2 className="text-lg font-semibold mt-2 md:text-2xl">
                        {userDocument}
                    </h2>
                </div>

                <div className="flex flex-col items-center ">

                    <h2 className="text-lg font-thin md:text-xl">
                        Por concepto de:
                    </h2>
                    <h2 className="text-xl font-semibold text-center md:text-2xl">
                        {concept}
                    </h2>

                </div>


                <div className="flex flex-col items-center justify-center  bg-white text-[#0B416E] w-[265px] h-[85px] px-5  rounded-[30px] md:w-[330px] md:h-[100px]">
                    <h2 className="text-lg md:text-xl">Total a Pagar</h2>
                    <p className="text-xl font-semibold md:text-2xl">{monto}</p>
                </div>


            </div>


            <div className='hidden font-light  md:flex absolute w-full max-w-[700px] bottom-20 justify-center px-24 text-lg'>
                <div className="w-full flex flex-row justify-between ">
                    <a className="cursor-pointer">Términos</a>
                    <a className="cursor-pointer">Ayuda</a>
                </div>
            </div>




        </div>




    )
}


export default SendingUserData;