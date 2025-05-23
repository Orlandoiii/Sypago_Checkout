import { useRef } from "react";
import CopyButton from "../../components/CopyClipBoard/CopyButton";
import NotificationIcon from "../icons/notifications/NotificationIcon";
import Modal from "../modal/Modal";
import { useState } from "react";
import { useEffect } from "react";
import ConfettiGenerator from "confetti-js";

function Title(operationResult) {
    switch (operationResult) {
        case "PEND":
            return "Operación Pendiente"
        case "PROC":
            return "Operación en Proceso"
        case "ACCP":
            return "Operación Aceptada"
        case "RJCT":
            return "Operación Rechazada"
    }
    return "PROC"
}


function DescribeComponent({ title = '', value = '' }) {


    const shortValue = value?.length > 16 ? value.substring(0, 15) + "..." : value;

    return (
        <div className="w-[275px] flex flex-row justify-between">
            <p className=" text-[#4E5463]">{title}</p>
            <p className="text-[#9BA1B0] font-light mr-6">{shortValue}</p>
        </div>
    )
}


function RefComponent({ refTitle = '', refValue = '' }) {

    return (<div className="w-[275px] flex flex-row justify-between ">
        <p className="text-[#4E5463] self-start">{refTitle}</p>
        <div className="flex justify-between">
            <p className="text-[#9BA1B0] font-light ">{refValue}</p>
            <div className="ml-2">
                <CopyButton textToCopy={refValue} />
            </div>
        </div>
    </div>)

}

function ErrorDescriptionComponent({ value = '' }) {

    const isLarge = value?.length > 16;

    const shortValue = isLarge ? value.substring(0, 18) + "..." : value;

    const [title, setTitle] = useState("Razón:")

    const [showDetail, setShowDetail] = useState(false);

    const [showValue, setShowValue] = useState(shortValue);

    return (
        <div className={`relative w-[275px] flex  ${showDetail ? "flex-col" : "flex-row"} justify-between transition-all duration-500`} >

            <p className={`text-[#4E5463] ${showDetail ? "translate-x-[115px]" : ""} transition-all duration-500`}>{title}</p>


            <div className={`flex items-center transition-all duration-500 `}>

                <p className={`text-[#9BA1B0] font-light  transition-all duration-500 ${showDetail ? "text-center" : "mr-7"}
                `}>{showValue}</p>

            </div>

            {isLarge && <button className="absolute w-[32px] h-[32px] right-0" onClick={
                (e) => {
                    setShowDetail(!showDetail);

                    if (!showDetail) {
                        setTitle("Razón");
                        setShowValue(value)
                    } else {
                        setTitle("Razón:");
                        setShowValue(shortValue)
                    }
                }
            }>
                <svg className={`fill-[#0065BB] hover:fill-blue-400 w-7 
                            transition-transform ${showDetail ? "rotate-180" : ""} transition-all duration-500`}
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
                    <path className="st0" d="M61.33,37.48L43.72,55.09c-2.08,2.08-5.45,2.08-7.52,0l-3.46-3.46L18.58,37.48c-2-1.99-2-5.23,0-7.22l0,0
	               c1.99-1.99,5.23-1.99,7.22,0L39.96,44.4l14.15-14.15c2-1.99,5.23-1.99,7.22,0l0,0C63.33,32.25,63.33,35.48,61.33,37.48z" />
                </svg>
            </button>}


        </div>
    )
}


function NotificationModal({
    open,
    onClickEvent,
    refBanco = null,
    refSypago = null,
    montoCobrado = null,
    montoPagado = null,
    razon = null,
    codigo = null,
    operationResult = "PEND",
    typeOfNotification = "SUCCESS",
}) {


    const canvasRef = useRef(null);


    const [confettiActive, setConfetiActive] = useState(false);


    const confettiGenerator = useRef(null);


    let amtsEquals = montoCobrado === montoPagado;


    const turnOnConfetti = () => {

        if (confettiGenerator.current && confettiGenerator.current?.clear) {
            confettiGenerator.current?.clear();
        }


        const confettiSettings = {
            target: canvasRef.current,
            props: ['circle', 'square'],


        };
        confettiGenerator.current = new ConfettiGenerator(confettiSettings);
        confettiGenerator.current.render();
        setConfetiActive(true);

    }

    const turnOffConfetti = () => {

        confettiGenerator.current?.clear();
        setConfetiActive(false);

    }

    useEffect(() => {

        return () => {
            if (confettiActive) confettiGenerator.current?.clear();
        }

    }, [])
    return (
        <>
            <Modal open={open}>

                <canvas ref={canvasRef} className={`${operationResult == "ACCP" ? "fixed top-0 left-0" : "hidden"} -z-10`}></canvas>

                <div className={`flex justify-center items-center w-full z-[1]`}>

                    <div className="flex flex-col justify-center items-center">

                        <div className="mt-[20px] cursor-pointer z-10" onClick={(e) => {
                            if (operationResult !== "ACCP")
                                return;

                            if (confettiActive)
                                turnOffConfetti();
                            else
                                turnOnConfetti();
                        }}>
                            <NotificationIcon width="w-[65px]" heigth="h-[65px]" type={typeOfNotification} />
                        </div>

                        <h3 className="font-semibold my-[20px]">{Title(operationResult)}</h3>

                        <div className="space-y-[0.15rem] mb-[20px]">

                            {refSypago && <RefComponent refTitle="Ref. SyPago:" refValue={refSypago} />}

                            {refBanco && <RefComponent refTitle="Ref. Banco:" refValue={refBanco} />}

                            {operationResult == "ACCP" && montoCobrado &&
                                <DescribeComponent title={amtsEquals ? "Monto:" : "Monto cobrado:"} value={montoCobrado} />}

                            {!amtsEquals && operationResult == "ACCP"
                                && montoPagado && <DescribeComponent title="Monto pagado:" value={montoPagado} />}

                            {typeOfNotification == "ERROR" && codigo && <DescribeComponent title="Código:" value={codigo} />}


                            {typeOfNotification == "ERROR" && razon && <ErrorDescriptionComponent value={razon} />}

                        </div>

                        <button
                            type="button"
                            className="text-center p-2 bg-primary  text-[whitesmoke] mb-[20px]  
                text-sm rounded-2xl  uppercase w-[100px] h-[40px] font-light "
                            onClick={(e) => {
                                if (onClickEvent)
                                    onClickEvent(e);
                            }}
                        >Ok</button>
                    </div>
                </div>
            </Modal>
        </>

    )
}


export default NotificationModal