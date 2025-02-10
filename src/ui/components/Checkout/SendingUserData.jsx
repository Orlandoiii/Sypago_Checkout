import React from 'react';
import BackArrow from '../../core/icons/BackArrow';
import BitMercadoDigitalLogo from '../../core/logo/BitMercadoDigitalLogo';
import ProductList from '../../core/products/ProductList';


function isValidURL(str) {
    try {
        new URL(str);
        return true;
    } catch (e) {
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
        rate = 1

    }
) {


    const productsIsNotEmpty = products != null &&
        Array.isArray(products) &&
        products.length > 0;

    const montoConvertido = (isBs ? monto / rate : monto * rate).toFixed(2);

    return (


        <div className="relative  h-full w-full flex flex-col justify-center items-center bg-transparent 
        text-[black] px-1 py-3 md:py-8  overflow-y-auto">

            {backUrl && isValidURL(backUrl) && <a
                className="absolute top-8 left-6  bg-main-bg-secundary rounded-xl flex justify-center 
                items-center self-start space-x-1 p-1 md:top-[3.5rem] md:left-[3rem] md:p-3 md:px-4"
                href={backUrl}
            >
                <BackArrow />
                <p className="text-main-bg text-md font-semibold hidden md:block">Regresar</p>
            </a>}

            <div className='flex h-full flex-col justify-center  items-center  
             [&>*]:my-[0.5rem]  md:[&>*]:my-[2rem]'>

                <div className="flex flex-col items-center">
                    <BitMercadoDigitalLogo mainColor='black' />
                    <h3 className='text-xl text-black font-semibold'>{userDocument}</h3>
                </div>


                {productsIsNotEmpty &&
                    <div className="flex flex-col items-center ">
                        <ProductList products={products} />
                    </div>
                }

                {!productsIsNotEmpty && concept && concept != '' &&
                    <div className="flex flex-col items-center ">

                        <h2 className="text-lg font-thin md:text-xl">
                            Cobro por concepto de:
                        </h2>
                        <h2 className="text-xl font-bold max-w-[350px] md:max-w-[75%] text-center md:text-2xl">
                            {concept}
                        </h2>

                    </div>
                }

                <div className="flex flex-col items-center justify-center  
                bg-main-bg-secundary text-main-bg gap-1
                w-[265px] h-[130px] px-5  rounded-[30px] md:w-[330px] ">


                    <h2 className="text-lg text-black font-semibold md:text-xl ">Monto a Pagar</h2>

                    <div className='flex flex-col justify-between items-center '>
                        <div className='flex justify-between items-center'>
                            <p className="text-xl text-black font-semibold md:text-2xl">{montoDisplay}</p>
                            <p className='text-xl text-black font-semibold md:text-2xl ml-2'>{isBs ? 'Bs' : '$'}</p>
                        </div>
                        <div className='text-md text-black flex justify-center items-center'>
                            <p>Ref en: {isBs ? ' $ ' + ` ${montoConvertido} ` : ' Bs ' + ` ${montoConvertido} `}</p>
                        </div>
                    </div>





                    <h3 className="text-sm text-black   md:text-lg">Tasa BCV: <span className='font-semibold'>{rateDisplay}</span></h3>
                </div>
            </div>



            <div className='hidden font-light mt-1 md:flex  w-full max-w-[700px] bottom-20 justify-center px-24 text-lg'>
                <div className="w-full flex flex-row justify-between ">
                    <a className="cursor-pointer">Términos</a>
                    <a className="cursor-pointer">Ayuda</a>
                </div>
            </div>




        </div>

    )
}


export default SendingUserData;