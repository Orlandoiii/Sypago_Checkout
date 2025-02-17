import React from 'react';
import BackArrow from '../../core/icons/BackArrow';
import BitMercadoDigitalLogo from '../../core/logo/BitMercadoDigitalLogo';
import ProductList from '../../core/products/ProductList';
import logger from '../../../logic/Logger/logger';

function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
        logger.error("ERROR EJECUTANDO:", e)
        return false;
    }
}

function SendingUserData(
    {
        isBs = true,
        monto = 0,
        montoDisplay = '',
        backUrl = null,
        userDocument = '',
        products = [],
        concept = '',
        rateDisplay = '',
        rate = 1,
        leadId = ""

    }
) {

    const productsIsNotEmpty = products != null &&
        Array.isArray(products) &&
        products.length > 0;

    const montoConvertido = (isBs ? monto / rate : monto * rate).toFixed(2);

    logger.log("Renderizando SendingUserData", monto, rate, montoConvertido)

    return (


        <div className="relative  h-full w-full flex flex-col justify-center items-center bg-transparent 
        text-[black] px-1 py-3 md:py-8  overflow-y-auto">

            {backUrl && isValidURL(backUrl) && <a
                className="absolute top-8 left-6  bg-main-bg-secundary drop-shadow-md rounded-xl flex justify-center 
                items-center self-start space-x-1 p-1 md:top-[3.5rem] md:left-[3rem] md:p-3 md:px-4"
                href={backUrl}
            >
                <BackArrow />
                <p className="text-md font-semibold hidden md:block text-black">Regresar</p>
            </a>}

            <div className='flex h-full flex-col justify-center  items-center  
               md:[&>*]:my-[2rem]'>

                <div className="flex flex-col space-y-1 items-center mt-4 md:mt-0">
                    <div className='w-[40%]'>
                    <BitMercadoDigitalLogo mainColor='black' />
                    </div>
                    
                    <h3 className='text-lg text-black font-semibold'>{userDocument}</h3>
                </div>
                {productsIsNotEmpty &&
                    <div className="flex flex-col items-center ">
                        <ProductList products={products} />
                    </div>
                }

                {!productsIsNotEmpty && concept && concept != '' &&
                    <div className="flex flex-col items-center mt-3 md:mt-8">

                        <h2 className="text-md font-thin md:text-xl">
                            Cobro por concepto de:
                        </h2>
                        <h2 className="text-lg font-bold max-w-[350px] md:w-full text-center md:text-xl">
                            {concept}
                        </h2>

                    </div>
                }

                <div className='bg-gradient-to-b from-blue-900 to-lime-300 flex justify-center items-center p-1 rounded-[30px] mt-1 md:mt-0'>
                    <div className="flex flex-col items-center justify-center
                    bg-main-bg-secundary text-main-bg gap-1
                    w-[230px]  h-[100px] px-5  rounded-[30px] md:w-[330px] ">


                        <h2 className="text-lg text-black font-semibold md:text-xl ">Monto a Pagar:</h2>

                        <div className='flex flex-col justify-between items-center '>
                            <div className='flex justify-between items-center space-x-2'>
                                <p className='text-lg text-black font-semibold md:text-xl'>{isBs ? 'Bs ' : '$ '}</p>
                                <p className="text-lg text-black font-semibold md:text-xl">{montoDisplay}</p>
                                <p className='text-black text-sm'>{`(${!isBs ? 'Bs' : '$'} ${montoConvertido})`}</p>
                            </div>

                        </div>



                        <h3 className="text-sm text-black   md:text-md">Tasa BCV: <span className='font-semibold'>{rateDisplay}</span></h3>
                    </div>
                </div>

                
            </div>



            {/* <div className='hidden font-light mt-1 md:flex  w-full max-w-[700px] bottom-20 justify-center px-24 text-lg'>
                <div className="w-full flex flex-row justify-between ">
                    <a className="cursor-pointer">Términos</a>
                    <a className="cursor-pointer">Ayuda</a>
                </div>
            </div> */}




        </div>

    )
}


export default SendingUserData;