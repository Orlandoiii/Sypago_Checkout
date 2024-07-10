import { useEffect, useReducer, useRef, useState } from "react";
import logger from "../../../logic/Logger/logger";
import { paymentNumberToName, useTransaction } from "../../contexts/TransactionContext";
import SypagoLogo from "../../core/logo/SypagoLogo";
import PayUserDataForm from "./Forms/PayUserDataForm";
import SendingUserData from "./SendingUserData";
import LoadModal from "../../core/modal/LoadModal";
import { useNotificationAlert } from "../../core/notifications/NotificationAlertModal";
import { SignalRService } from "../../../logic/SignalRCom/SignalRCom";
import { useConfig } from "../../contexts/ConfigContext";
import { isMobile } from "react-device-detect";
import DetailConfirmation from "../DetailConfirmation/DetailConfirmation";
import OtpForm from "./Forms/OtpForm";
import Modal from "../../core/modal/Modal";
import NotificationModal from "../../core/notifications/NotificationModal";
import AcceptError from "../../../logic/models/AcceptError";
import { useNavigate } from "react-router-dom";



const translateXeffect = {
    effectVisible: "translate-x-0",

    effectOneHidden: "-translate-x-full",

    effectTwoHidden: "translate-x-full "
}


const translateYeffect = {
    effectVisible: "translate-y-0",

    effectOneHidden: "-translate-y-full",

    effectTwoHidden: "translate-y-full "
}

const notificationInitialState = {
    open: false,
    refBanco: "",
    refSypago: "",
    montoCobrado: "",
    montoPagado: "",
    razon: "",
    codigo: "",
    operationResult: "",
    typeOfNotification: "",
}

function notificationModalReducer(state, action) {

    const data = action.payload;
    switch (action.type) {
        case "notification/open": {
            return {
                ...state,
                open: true,
                refSypago: data?.refSypago,
                refBanco: data?.refBanco,
                montoCobrado: data?.montoCobrado,
                montoPagado: data?.montoPagado,
                razon: data?.razon,
                codigo: data?.codigo,
                operationResult: data?.operationResult,
                typeOfNotification: data?.typeOfNotification
            }
        }

        case "notification/close": {
            return {
                ...state,
                open: false
            }
        }
    }
}

function useNotificationReducer() {
    const [state, dispatch] = useReducer(notificationModalReducer, notificationInitialState);

    return { notificationState: state, dispatchNotification: dispatch }
}



function CheckoutComponent({ isBlueprint = false, transactionId = "" }) {



    const visebleTranslateEffect = isMobile ? translateYeffect.effectVisible : translateXeffect.effectVisible;

    const effectTranslateOne = isMobile ? translateYeffect.effectOneHidden : translateXeffect.effectOneHidden;

    const effectTranslateTwo = isMobile ? translateYeffect.effectTwoHidden : translateXeffect.effectTwoHidden;


    const { transactionState, dispatch } = useTransaction();

    const [openLoadModal, setOpenLoadModal] = useState(false);

    const [loadModalMessage, setLoadModalMessage] = useState("");

    const { openAlertNotification } = useNotificationAlert();

    const [openDetail, setOpenDetail] = useState(false);

    const [openOtp, setOpenOtp] = useState(false);

    const [receptSubmitData, setReceptSubmitData] = useState({});


    const { notificationState, dispatchNotification } = useNotificationReducer();



    const timeoutPayRef = useRef(null);

    const { config } = useConfig();

    const sypagoUrl = config.sypago_url + "/CheckoutHub";

    const navigate = useNavigate();


    const linkRef = useRef(null);


    const [callBackUrl, setCallBackUrl] = useState("");

    logger.info("Transaction State Renderizo Checkout Componenet", transactionState, config);


    const dataIsLoaded = transactionState.isLoaded();


    const [confirmationData, setConfirmationData] = useState([])

    function onSubmitPayForm(data) {

        const transaction = transactionState.transactionData;
        const amount = transaction.amount;
        const sendingUserData = transaction.sending_user;
        const receivingUserData = data;



        const emisorObj = {
            section_name: "Datos Cobrador",
            section_data: [

                {
                    name: "Nombre",
                    data: sendingUserData.name
                },
                {
                    name: "Nro Documento",
                    data: `${sendingUserData.document_info.type}${sendingUserData.document_info.number}`
                },
                {
                    name: "Concepto",
                    data: transaction.concept
                }

            ]
        }

        const receptObj = {
            section_name: "Datos Pagador",
            section_data: [

                {
                    name: "Banco",
                    data: receivingUserData.bank_name
                },
                {
                    name: "Nro Documento",
                    data: `${receivingUserData.doc_prefix}${receivingUserData.doc_number}`
                },
                {
                    name: [receivingUserData.acct_name],
                    data: receivingUserData.acct_type == "CELE" ?
                        receivingUserData.phone : receivingUserData.acct
                }

            ]
        }

        const receptData = {
            bank_code: receivingUserData.bank_code,
            doc_number: receivingUserData.doc_number,
            doc_prefix: receivingUserData.doc_prefix,
            acct_type: receivingUserData.acct_type,
            acct_number: receivingUserData.acct_type == "CELE" ?
                receivingUserData.phone : receivingUserData.acct,
        }


        if (amount.type != "NONE" && amount.amt != receivingUserData.amt) {

            receptData.pay_amt = parseFloat(receivingUserData.amt);
            emisorObj.section_data.push(
                {
                    name: "Monto Cobrado",
                    data: amount.amt
                })
            receptObj.section_data.push({
                name: "Monto Pagado",
                data: receivingUserData.amt
            })
        }
        else {

            receptData.pay_amt = parseFloat(amount.amt);

            emisorObj.section_data.push(
                {
                    name: "Monto",
                    data: amount.amt
                })
        }

        const detailData = [emisorObj, receptObj];




        setReceptSubmitData(receptData);
        setConfirmationData(detailData);
        setOpenDetail(true);


    }

    function onConfirm() {
        setOpenDetail(false);
        setOpenOtp(true);
    }


    function failPayProcess(message) {
        setLoadModalMessage("");
        setOpenLoadModal(false);
        penAlertNotification("error", message)
    }

    function onSubmitOtp(otpValue) {

        logger.info("OTP Value:", otpValue);


        const transaction = receptSubmitData;

        const payAmt = transaction.pay_amt;

        const typeOfDoc = transaction.doc_prefix;

        const acctType = transaction.acct_type == "CELE" ? 1 : 0;

        const otp = otpValue;

        const receptUser = {
            Id: typeOfDoc + transaction.doc_number,
            Account: {
                BankCode: transaction.bank_code,
                Id: transaction.acct_number,
                Tp: acctType,
            }
        }

        SignalRService.AcceptTransaction(transactionId, payAmt,
            receptUser, otp, isBlueprint
        ).then(result => {

            if (result && result.isSuccessful) {
                timeoutPayRef.current = setTimeout(() => {
                    failPayProcess(`Lo sentimos pero tenemos incovenientes 
                        por favor verifique con su banco si los fondos han sido debitads Ref:${transactionId}`)
                }, 180000)

                return;

            }
            if (!result || !result.isSuccessful) {


                const acceptResult = AcceptError.GenerateAcceptError(result?.err);

                if (acceptResult?.GetErrorMessage() != "RATECHANGE") {
                    logger.error("Error iniciando pago:", result)
                    failPayProcess('Lo sentimos tenemos problemas para iniciar el pago')
                    return
                }

                SignalRService.GetTransaction(transactionId, isBlueprint)
                    .then(result => {
                        if (!result.isSuccessful) {
                            logger.error(result.err);
                            failPayProcess("Lo sentimos tenemos problemas para iniciar el pago")
                            return;
                        }
                        dispatch({ type: "transaction/setdata", payload: { transactionData: result.value } })
                        setOpenLoadModal(false);
                        openAlertNotification("info", "Lo sentimos pero la tasa BCV cambio verifique el nuevo monto e intente nuevamente")

                    }).catch(err => {
                        logger.error(err);
                        failPayProcess("Lo sentimos tenemos problemas para iniciar el pago");
                    })



            }
        }).catch(err => {
            logger.error("Error iniciando pago:", err)
            failPayProcess('Lo sentimos tenemos problemas para iniciar el pago')
        });

        dispatch({ type: "transaction/process" })
        setLoadModalMessage("Procesando Pago");
        setOpenLoadModal(true);
        setOpenOtp(false);
    }


    async function onNotify(transactionStatusJson, hash) {



        logger.info("Llego Notificacion a la vista", transactionStatusJson);


        const transactionStatus = JSON.parse(transactionStatusJson);

        if (timeoutPayRef.current)
            clearInterval(timeoutPayRef.current);


        dispatch({
            type: "transaction/status",
            payload: {
                status: transactionStatus,
                hash: hash,
                originalMessageStatus: transactionStatusJson
            }
        })

        const txSts = paymentNumberToName[transactionStatus.TxSts]

        let isACCP = txSts == "ACCP";


        let typeOfNotification = "SUCCESS"

        if (!isACCP) {
            typeOfNotification = "ERROR";
        }


        let referenciaIBp = "";

        if (transactionStatus.EndToEndId && transactionStatus.EndToEndId > 8) {
            referenciaIBp = transactionStatus.EndToEndId.slice(-8);
        }

        const data = {
            refBanco: referenciaIBp,
            refSypago: transactionStatus.TransactionId,
            montoCobrado: transactionStatus.Amount,
            montoPagado: transactionStatus.PayAmount,
            codigo: transactionStatus.Rsn,
            razon: !isACCP ?
                transactionState.rjctCodes.find(v => v.code == transactionStatus.Rsn).description : "",
            operationResult: txSts,
            typeOfNotification: typeOfNotification

        }


        setOpenLoadModal(false);
        dispatchNotification({ type: "notification/open", payload: { ...data } })


    }


    async function onReconnected() {

    }


    useEffect(() => {

        if (isBlueprint)
            dispatch({
                type: "transaction/settoblueprint",
                payload: { transactionId: transactionId }
            })
        else {
            dispatch({
                type: "transaction/settotransaction",
                payload: { transactionId: transactionId }
            })
        }

    }, [])


    useEffect(() => {
        if (transactionState.isError) {
            setOpenLoadModal(false);
            openAlertNotification("error", transactionState.error);
        }
    }, [transactionState.isError])



    useEffect(() => {


        if (!dataIsLoaded) {
            setLoadModalMessage("Cargando Operacion")
            setOpenLoadModal(true);

            SignalRService.Init(sypagoUrl)
                .then(() => {


                    SignalRService.GetAllBanks()
                        .then((b) => {
                            logger.info("RESULT Banks", b);

                            if (!b.isSuccessful) {
                                logger.error(b.err);
                                return;
                            }

                            dispatch({ type: "transaction/setbanks", payload: { banks: b.value } })
                        }).catch(err => {

                        })
                    SignalRService.GetTransaction(transactionId, isBlueprint)
                        .then((t) => {
                            logger.info("RESULT Transaction", t);

                            if (!t.isSuccessful) {
                                logger.error(t.err);
                                return;
                            }



                            dispatch({ type: "transaction/setdata", payload: { transactionData: t.value } })
                        }).catch(err => {

                        })


                    SignalRService.GetAllRejectCodes()
                        .then((c) => {
                            logger.info("RESULT RJCT CODES", c);

                            if (!c.isSuccessful) {
                                logger.error(c.err);
                                return;
                            }

                            dispatch({ type: "transaction/setcodes", payload: { codes: c.value } })
                        }).catch(err => {

                        })
                }).catch(err => {
                    logger.error(err);
                    openAlertNotification("error", "ERROR")

                })
        } else {
            setLoadModalMessage("")
            setOpenLoadModal(false);
        }

        if (dataIsLoaded) {





            SignalRService.notificationSub = onNotify;
            SignalRService.onReconnectedSub = onReconnected;
            return () => { SignalRService?.Stop() };
        }



    }, [dataIsLoaded])


    logger.log("Renderizo CheckoutComponent with data:", transactionState.transactionData)


    return (
        <>
            <div className='bg-transparent w-full h-screen flex justify-center items-center rounded-md shadow-md'>

                <main className='relative bg-[#0B416E] flex flex-col  md:flex-row w-full h-full max-h-[1080px] max-w-[1920px] overflow-x-hidden '>

                    {!transactionState.isLoaded() && <div className="absolute top-1/2 left-1/2 transform 
                    -translate-x-1/2 -translate-y-1/2
                    flex justify-center items-center">
                        <div className="w-[350px] md:w-[560px] h-auto block">
                            <SypagoLogo negative={true} />
                        </div>
                    </div>}

                    <section className='w-full  md:w-[50%] h-full'>




                        <div className={`w-full h-full transition-all ease-in-out duration-700
                            ${transactionState.isLoaded() ? visebleTranslateEffect + " opacity-100" : effectTranslateOne + " opacity-0"}`}>

                            {transactionState.isLoaded() && <SendingUserData
                                userName={transactionState.transactionData?.receiving_user?.name}
                                concept={transactionState.transactionData?.concept}
                                monto={transactionState.transactionData?.amount?.amt}
                                backUrl={transactionState.transactionData?.notification_urls?.return_front_end_url}
                            />}

                        </div>




                    </section>

                    <section className={`w-full h-full md:w-[50%] flex 
                flex-col justify-center items-center  
                bg-[whitesmoke] py-8 rounded-t-[1.75rem] md:rounded-none md:rounded-l-[3.5rem] transition-all ease-in-out  duration-700 
                            ${transactionState.isLoaded() ? visebleTranslateEffect + " opacity-100" : effectTranslateTwo + " opacity-100"}`}>

                        <div className="hidden w-[380px] h-auto mb-8 md:block">
                            <SypagoLogo />
                        </div>

                        <div className={`w-full `} >
                            {transactionState.isLoaded() &&
                                <PayUserDataForm
                                    banks={transactionState.banks}
                                    receivingUser={transactionState.transactionData?.receiving_user}
                                    amount={transactionState.transactionData?.amount}
                                    onSubmit={onSubmitPayForm}

                                />}
                        </div>

                    </section>

                </main>

                <a ref={linkRef} href={callBackUrl}></a>
            </div >

            <DetailConfirmation
                open={openDetail}
                data={confirmationData}
                onBack={() => { setOpenDetail(false) }}
                onConfirm={onConfirm}
            />



            <Modal
                open={openOtp}
                showX={true}
                onClose={() => { setOpenOtp(false) }}>
                <OtpForm
                    otpLen={8}
                    timerTime={35}
                    isBlueprint={isBlueprint}
                    transactionId={transactionId}
                    transactionData={receptSubmitData}
                    onSubmitOtpEvent={onSubmitOtp}
                />
            </Modal>

            <NotificationModal
                open={notificationState.open}
                refSypago={notificationState.refSypago}
                refBanco={notificationState.refBanco}
                montoCobrado={notificationState.montoCobrado}
                montoPagado={notificationState.montoPagado}
                razon={notificationState.razon}
                codigo={notificationState.codigo}
                operationResult={notificationState.operationResult}
                typeOfNotification={notificationState.typeOfNotification}
                onClickEvent={() => {
                    dispatchNotification({ type: "notification/close" });

                    if (transactionState.transactionData.type == "RedirectToCheckout") {

                        const resultForUrl =
                            `?result=${transactionState.originalMessageStatus}&hash=${transactionState.hash}`

                        let callBackUrl = transactionState.paymentStatus == "ACCP" ?
                            transactionState.transactionData.notification_urls.sucessful_callback_url :
                            transactionState.transactionData.notification_urls.failed_callback_url;

                        callBackUrl = callBackUrl + resultForUrl;

                        

                        //navigate(callBackUrl)
                        return;
                    }
                }}

            />


            <LoadModal
                open={openLoadModal}
                message={loadModalMessage}
                subscribeToController={false} />




        </>


    );
}

export default CheckoutComponent;