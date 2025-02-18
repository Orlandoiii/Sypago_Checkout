import { useRef } from "react";
import CopyButton from "../../components/CopyClipBoard/CopyButton";
import NotificationIcon from "../icons/notifications/NotificationIcon";
import Modal from "../modal/Modal";
import { useState } from "react";
import { useEffect } from "react";
import ConfettiGenerator from "confetti-js";
import ShareIcon from "../icons/ShareIcon";
import html2canvas from 'html2canvas';
import BitMercadoDigitalLogo from "../logo/BitMercadoDigitalLogo";
import logger from "../../../logic/Logger/logger";

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


    //const shortValue = value?.length > 16 ? value.substring(0, 15) + "..." : value;

    return (
        <div className="w-[350px] flex flex-row justify-between">
            <div className=" text-slate-900 font-bold w-[40%] text-sm md:text-base">{title}</div>
            <div className="text-black font-light mr-6 text-right w-[60%] text-sm md:text-base">{value}</div>
        </div>
    )
}


function RefComponent({ refTitle = '', refValue = '' }) {

    return (
    <div className=" w-[350px] flex flex-row justify-between ">
        <p className="text-slate-900 font-bold self-start text-sm md:text-base">{refTitle}</p>
        <div className="flex justify-between">
            <p className="text-black font-light text-sm md:text-base">{refValue}</p>
            <div className="ml-2 flex justify-center items-center">
                <CopyButton textToCopy={refValue} />
            </div>
        </div>
    </div>
    )

}

function ErrorDescriptionComponent({ value = '', showArrow = true }) {

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

            {isLarge && showArrow && <button className="absolute w-[32px] h-[32px] right-0" onClick={
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

function FormatDate(date) {
    if (!date) return '';
    const day = new Date(date).getDate().toString().padStart(2, '0');
    const month = (new Date(date).getMonth() + 1).toString().padStart(2, '0');
    const year = new Date(date).getFullYear();
    // Get hours in 12-hour format
    let hours = new Date(date).getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    
    // Get minutes
    const minutes = new Date(date).getMinutes().toString().padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

function NotificationModal({
    open,
    onClickEvent,
    refBanco = null,
    refSypago = null,
    refInternal = null,
    montoCobrado = null,
    montoPagado = null,
    razon = null,
    codigo = null,
    operationResult = "PEND",
    typeOfNotification = "SUCCESS",
    fechaPago = null,
    bancoPagador = null,
    accountNumber = null,
    cedulaPagador = null,
    concepto = null,
    leadId = null
}) {


    const canvasRef = useRef(null);
    const modalContentRef = useRef(null);

    const [showArrow, setShowArrow] = useState(true);

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

    // Helper to create a canvas image for sharing that mimics the modal's style
    const createNotificationShareImage = () => {
        const canvas = document.createElement('canvas');
        const width = 400;
        const height = 600;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
    
        // Draw white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
    
        // --- Top Logo (simulated) ---
        ctx.textAlign = 'center';
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#000000';
        // Simulate BitMercadoDigitalLogo with text
        ctx.fillText('BitMercado Digital', width / 2, 30);
    
        // --- Notification Icon (simulated as a colored circle) ---
        // Determine the icon's color based on the notification type
        let iconColor = '#0065BB'; // default blue
        if (typeOfNotification === "SUCCESS") {
            iconColor = '#22c55e'; // green
        } else if (typeOfNotification === "ERROR") {
            iconColor = '#ef4444'; // red
        } else if (typeOfNotification === "INFO") {
            iconColor = '#3b82f6'; // blue
        } else if (typeOfNotification === "WARNING") {
            iconColor = '#facc15'; // yellow
        }
        ctx.fillStyle = iconColor;
        ctx.beginPath();
        // Draw a circle to represent the notification icon
        ctx.arc(width / 2, 80, 35, 0, Math.PI * 2, true);
        ctx.fill();
    
        // --- Notification Title ---
        ctx.textAlign = 'center';
        ctx.font = '600 20px Arial';
        ctx.fillStyle = '#0F172A';
        ctx.fillText(Title(operationResult), width / 2, 130);
    
        // --- Data Details (simulating DescribeComponent rows) ---
        const leftMargin = 20;
        const rightMargin = 20;
        let y = 160;
        const lineHeight = 28;
    
        // Helper to draw a row with label (left, bold, slate color) and value (right, light)
        const drawDataRow = (label, value) => {
            // Draw Label
            ctx.textAlign = 'left';
            ctx.font = 'bold 16px Arial';
            ctx.fillStyle = '#1e293b'; // approximating text-slate-900
            ctx.fillText(label, leftMargin, y);
            // Draw Value
            ctx.textAlign = 'right';
            ctx.font = 'normal 16px Arial';
            ctx.fillStyle = '#000000';
            ctx.fillText(value, width - rightMargin, y);
            y += lineHeight;
        };
    
        if (concepto) {
            drawDataRow('Concepto:', concepto);
        }
        if (operationResult === "ACCP" && montoCobrado) {
            drawDataRow('Monto:', `Bs. ${montoCobrado}`);
        }
        if (fechaPago) {
            drawDataRow('Fecha de pago:', FormatDate(fechaPago));
        }
        if (bancoPagador) {
            drawDataRow('Banco pagador:', bancoPagador);
        }
        if (accountNumber) {
            drawDataRow('Cuenta:', accountNumber);
        }
        if (cedulaPagador) {
            drawDataRow('Cédula:', cedulaPagador);
        }
        if (refInternal) {
            drawDataRow('Ref Interna:', refInternal);
        }
        if (refBanco) {
            drawDataRow('Ref. Banco:', refBanco);
        }
        if (refSypago) {
            drawDataRow('Ref. SyPago:', refSypago);
        }
        if (leadId) {
            drawDataRow('ID:', `#${leadId}`);
        }
        if (typeOfNotification === "ERROR" && codigo) {
            drawDataRow('Código:', codigo);
        }
        if (typeOfNotification === "ERROR" && razon) {
            drawDataRow('Razón:', razon);
        }
    
        return canvas;
    };
    
    // Updated share handler that builds the share image directly from the canvas
    const handleShare = async () => {
        try {
            // Create the shareable canvas image
            const shareCanvas = createNotificationShareImage();
            const blob = await new Promise(resolve => shareCanvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'notification.png', { type: blob.type });
    
            if (navigator.share) {
                console.log("Using navigator.share");
                await navigator.share({
                    files: [file],
                    title: 'Notification Details',
                    text: 'Check out this notification'
                });
                console.log("Share successful");
            } else {
                // Fallback: download the image
                console.log("Fallback: downloading image");
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'notification.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    logger.info("Notification Modal:", {
        open,
        onClickEvent,
        refBanco,
        refSypago,
        refInternal,
        montoCobrado,
        montoPagado,
        razon,
        codigo,
        operationResult,
        typeOfNotification,
        fechaPago,
        bancoPagador,
        cedulaPagador,
        concepto,
        leadId
    })



    return (
        <>
            <Modal open={open}>

                <canvas ref={canvasRef} className={`${operationResult == "ACCP" ? "fixed top-0 left-0" : "hidden"} -z-10`}></canvas>

                <div className={`relative flex justify-center items-center w-full z-[1] pt-8`}>

                    <button
                        onClick={handleShare}
                        className="absolute top-4 right-4 bg-slate-100 rounded-full p-2 shadow-lg flex justify-center items-center hover:bg-slate-200 transition-colors"
                    >
                        <ShareIcon width="w-[25px] md:w-[32px]" height="h-[25px] md:h-[32px]" />
                    </button>

                    <div ref={modalContentRef} className="flex flex-col justify-center items-center">

                        <div className="mt-4 w-full h-[60px] flex justify-center items-center">
                            <div className="w-[220px] h-[80px] flex justify-center items-center">
                                <BitMercadoDigitalLogo mainColor="color" />
                            </div>
                        </div>

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

                        <div className="mb-[20px] space-y-[0.15rem]">

                            {concepto && <DescribeComponent title="Concepto:" value={concepto} />}

                            {operationResult == "ACCP" && montoCobrado &&
                                <DescribeComponent title={amtsEquals ? "Monto:" : "Monto:"} value={`Bs. ${montoCobrado}`} />}
                            
                            {fechaPago && <DescribeComponent title="Fecha de pago:" value={FormatDate(fechaPago)} />}
                            
                            {bancoPagador && <DescribeComponent title="Banco pagador:" value={bancoPagador} />}

                            {accountNumber && <DescribeComponent title="Cuenta o Número pagador:" value={accountNumber} />}

                            {cedulaPagador && <DescribeComponent title="Cédula pagador:" value={cedulaPagador} />}
                            
                            {(typeOfNotification == "INFO" || typeOfNotification == "ERROR") && refInternal &&
                                <RefComponent refTitle="Ref Interna:" refValue={refInternal} />
                            }

                            {refBanco && <RefComponent refTitle="Ref. Banco:" refValue={refBanco} />}

                            {refSypago && <RefComponent refTitle="Ref. SyPago:" refValue={refSypago} />}

                            {leadId && <DescribeComponent title="ID:" value={`#${leadId}`} />}

                            {typeOfNotification == "ERROR" && codigo && <DescribeComponent title="Código:" value={codigo} />}

                            {typeOfNotification == "ERROR" && codigo && <DescribeComponent title="Razón:" value={razon} />}

                            {/* {typeOfNotification == "ERROR" && razon && <ErrorDescriptionComponent showArrow={showArrow} value={razon} />} */}

                            


                        </div>


                        <button
                            type="button"
                            className="text-center p-2 bg-primary  text-[whitesmoke] mb-[20px]  
                text-sm rounded-2xl  uppercase w-[100px] h-[40px] font-light ok-button"
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