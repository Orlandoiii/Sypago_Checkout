import { useEffect, useReducer, useRef, useState } from "react";
import logger from "../../../logic/Logger/logger";
import { paymentNumberToName, useTransaction } from "../../contexts/TransactionContext";
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
import { FormatAsFloat, ParseToFloat } from "../../core/input/InputBox";
import Logo from "../../core/logo/Logo";


// const productsExample = [
//     {
//         id: 1,
//         title: "Portable Stereo Speaker",
//         price: 230.49,
//         image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=2069&auto=format&fit=crop",
//         quantity: 1
//     },
//     {
//         id: 2,
//         title: "Wireless Headphones",
//         price: 159.99,
//         image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
//         quantity: 1
//     },
//     {
//         id: 3,
//         title: "Smart Watch Pro",
//         price: 299.99,
//         image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2064&auto=format&fit=crop",
//         quantity: 1
//     },
//     {
//         id: 4,
//         title: "Wireless Earbuds",
//         price: 129.99,
//         image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2069&auto=format&fit=crop",
//         quantity: 1
//     },
//     {
//         id: 5,
//         title: "Gaming Mouse",
//         price: 79.99,
//         image: "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1928&auto=format&fit=crop",
//         quantity: 1
//     }
// ];


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
    refInternal: ""
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
                typeOfNotification: data?.typeOfNotification,
                refInternal: data?.refInternal
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

function getRate(bcvRates) {
    for (const rate of bcvRates) {
        if (rate.code == "USD") {
            return rate.rate;
        }
    }
    return null;
}
function convertCurrency(amount, currency, isBs, bcvRates) {

    logger.info("convertCurrency", bcvRates)

    if (bcvRates == null || !Array.isArray(bcvRates))
        return amount;

    if (currency == "VES" && isBs) {
        return amount;
    }
    if (currency == "USD" && !isBs) {
        return amount;
    }
    const rate = getRate(bcvRates);


    if (currency == "VES") {
        if (isBs) {
            return amount;
        }
        return amount / rate;
    }

    if (currency == "USD") {
        if (!isBs) {
            return amount;
        }
        return amount * rate;
    }

}

function getStatusDescription(code, rejectCodes) {
    if (!rejectCodes || !Array.isArray(rejectCodes)) return "";

    const status = rejectCodes.find(s => s.code === code);
    return status ? status.description : "";
}

function getSendingUserId(transactionState) {
    if (transactionState == null || transactionState?.transactionData == null)
        return "";

    const t = transactionState?.transactionData
    let sendingUserId = ""

    if (t.sending_user != null) {
        sendingUserId = t.sending_user.document_info.type + t.sending_user.document_info.number
    }
    return sendingUserId
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


    const [isBs, setIsBs] = useState(true);

    const timeoutPayRef = useRef(null);

    const getTransactionInterval = useRef(null);

    const { config } = useConfig();

    const sypagoUrl = config.sypago_url + "/bitmercado/checkouthub";



    const linkRef = useRef(null);



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
                    data: "Bit Mercado Digital"
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


        let chargeAmout = amount.amt;
        let payAmt = receivingUserData.amt;


        if (amount.currency == "USD") {
            chargeAmout = convertCurrency(chargeAmout, "USD", true, transactionState.bcvRates);
        }

        if (amount.type != "NONE" && chargeAmout !== payAmt) {

            receptData.pay_amt = payAmt;
            emisorObj.section_data.push(
                {
                    name: "Monto Cobrado",
                    data: FormatAsFloat(chargeAmout) + " Bs"
                })
            receptObj.section_data.push({
                name: "Monto Pagado",
                data: FormatAsFloat(payAmt)
            })
        }
        else {

            receptData.pay_amt = chargeAmout;

            emisorObj.section_data.push(
                {
                    name: "Monto",
                    data: FormatAsFloat(chargeAmout) + " Bs"
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
        openAlertNotification("error", message)
    }

    function onSubmitOtp(otpValue) {

        logger.info("OTP Value:", otpValue);


        const transaction = receptSubmitData;

        const payAmt = transaction.pay_amt;

        const typeOfDoc = transaction.doc_prefix;

        //const acctType = transaction.acct_type == "CELE" ? 1 : 0;

        const otp = otpValue;

        const receptUser = {
            Id: typeOfDoc + transaction.doc_number,
            Account: {
                BankCode: transaction.bank_code,
                Id: transaction.acct_number,
                Tp: transaction.acct_type,
            }
        }


        const acceptData = {
            transaction_id: transactionId,
            pay_amt: payAmt,
            receiving_user: {
                account: {
                    bank_code: receptUser.Account.BankCode,
                    number: receptUser.Account.Id,
                    type: receptUser.Account.Tp
                },
                document_info: {
                    type: typeOfDoc,
                    number: receptUser.Id
                }
            },
            otp: otp
        }



        SignalRService.AcceptTransaction(acceptData, isBlueprint
        ).then(result => {

            if (result) {

                timeoutPayRef.current = setTimeout(() => {
                    failPayProcess(`Lo sentimos pero tenemos incovenientes 
                        por favor verifique con su banco si los fondos han sido debitados Ref:${transactionId} y recargue la pagina`)
                }, 120000)


                getTransactionInterval.current = setInterval(async () => {

                    logger.info("Pidiendo status de la transaccion")

                    const response = await fetch(config.sypago_url + "/bitmercado/transaction/" + transactionId)

                    if (response.status != 200)
                        return;

                    const transactionStatus = await response.json();

                    logger.info("Transaction HTTP Status:", transactionStatus)

                    if (transactionStatus.status != "PEND" && transactionStatus.status != "PROC") {
                        clearInterval(getTransactionInterval.current);
                        processTransaction(transactionStatus)
                        return;
                    }

                }, 5000)


                return;

            }


            failPayProcess('Lo sentimos tenemos problemas para iniciar el pago, por favor recargue la pagina e intente nuevamente')
            return

        }).catch(err => {
            logger.error("Error iniciando pago:", err)
            failPayProcess('Lo sentimos tenemos problemas para iniciar el pago')
            return;
        });

        dispatch({ type: "transaction/process" })
        setLoadModalMessage("Procesando Pago");
        setOpenLoadModal(true);
        setOpenOtp(false);
    }

    function processTransaction(transactionStatus) {

        if (timeoutPayRef.current)
            clearInterval(timeoutPayRef.current);

        if (getTransactionInterval.current)
            clearInterval(getTransactionInterval.current);


        const txSts = transactionStatus.status


        let isACCP = txSts == "ACCP";


        let typeOfNotification = "SUCCESS"

        if (!isACCP) {
            typeOfNotification = "ERROR";

            if (transactionStatus.status == "PROC" || transactionStatus.status == "PEND") {
                typeOfNotification = "INFO";
            }
        }


        let referenciaIBp = "";

        let referenciaSypago = transactionStatus.transactionIdSypago

        let referenciaInternal = transactionStatus.transactionId

        if (transactionStatus.endToEndId && transactionStatus.endToEndId > 8) {
            referenciaIBp = transactionStatus.endToEndId.slice(-8);
        }


        const data = {
            refBanco: referenciaIBp,
            refSypago: referenciaSypago,
            refInternal: referenciaInternal,
            montoCobrado: FormatAsFloat(transactionStatus.amount.amt),
            montoPagado: FormatAsFloat(transactionStatus.amount.pay_amt),
            codigo: transactionStatus.rsn,
            razon: getStatusDescription(transactionStatus.rsn, transactionState.rjctCodes),
            operationResult: txSts,
            typeOfNotification: typeOfNotification

        }


        setOpenLoadModal(false);

        dispatchNotification({ type: "notification/open", payload: { ...data } })
    }

    async function onNotify() {

        logger.info("Llego Notificacion del status");

        if (timeoutPayRef.current)
            clearInterval(timeoutPayRef.current);

        if (getTransactionInterval.current)
            clearInterval(getTransactionInterval.current);


        const transactionStatus = await SignalRService.GetTransaction(transactionId, isBlueprint)

        if (!transactionStatus)
            return;

        processTransaction(transactionStatus)

    }

    async function onReconnected() {

        const transactionStatus = await SignalRService.GetTransaction(transactionId, isBlueprint)

        if (transactionStatus && (transactionStatus.status == "ACCP" || transactionStatus.status == "RJCT"))
            processTransaction(transactionStatus)

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

        if (!transactionState.isError)
            return;

        if (transactionState.errorCode == "NOTPEND") {

            if (!dataIsLoaded) {
                return;
            }


            const transaction = transactionState.transactionData;

            let referenciaIBp = "";

            if (transaction.endToEndId != null && transaction.endToEndId > 8) {
                referenciaIBp = transaction.endToEndId.slice(-8);
            }

            let isACCP = transaction.status == "ACCP";

            let typeOfNotification = "SUCCESS"

            if (!isACCP) {
                typeOfNotification = "ERROR";
                if (transaction.status == "PROC") {
                    typeOfNotification = "INFO";
                }
            }

            logger.info("RAZON:", transactionState.rjctCodes)

            const data = {
                refInternal: transaction.transactionId,
                refBanco: referenciaIBp,
                refSypago: transaction.transactionIdSypago,
                montoCobrado: FormatAsFloat(transaction.amount.amt),
                montoPagado: FormatAsFloat(transaction.amount.pay_amt),
                codigo: transaction.rsn,
                razon: getStatusDescription(transaction.rsn, transactionState.rjctCodes),
                operationResult: transaction.status,
                typeOfNotification: typeOfNotification,

            }

            dispatchNotification({ type: "notification/open", payload: { ...data } })
            SignalRService.Stop();
            return;


        }


        setOpenLoadModal(false);
        openAlertNotification("error", transactionState.error);

    }, [transactionState.isError, dataIsLoaded])


    useEffect(() => {


        if (!dataIsLoaded) {
            setLoadModalMessage("Cargando Operacion")
            setOpenLoadModal(true);



            SignalRService.Init(sypagoUrl)
                .then(() => {



                    SignalRService.GetBcvRates()
                        .then((r) => {
                            logger.info("RESULT BCV RATES", r)
                            dispatch({
                                type: "transaction/setbcvrates",
                                payload: { bcvRates: r }
                            })
                        }).catch(err => {
                            logger.error(err)
                            dispatch({
                                type: "transaction/seterror",
                                payload: {
                                    error: "No se pudo obtener las tasas de BCV",
                                    errorCode: err.message,
                                    transactionData: {},
                                    transactionDataIsLoaded: false,
                                }
                            })
                        })


                    SignalRService.GetAllBanks()
                        .then((b) => {
                            logger.info("RESULT Banks", b);

                            if (b == null) {
                                logger.error(b.err);
                                throw new Error(b);
                            }


                            dispatch({ type: "transaction/setbanks", payload: { banks: b } })
                        }).catch(err => {

                            dispatch({
                                type: "transaction/seterror",
                                payload: {
                                    error: "No se pudo obetener los codigos de Banco",
                                    errorCode: err.message,
                                    transactionData: {},
                                    transactionDataIsLoaded: false,
                                }
                            })
                        })
                    SignalRService.GetTransaction(transactionId, isBlueprint)
                        .then((t) => {
                            logger.info("RESULT Transaction", t);

                            if (t == null || t.status != "PEND") {


                                logger.error("La operacion ya no esta pendiente:", t);

                                if (t.status != "PEND") {

                                    dispatch({
                                        type: "transaction/seterror",
                                        payload: {
                                            error: t.err,
                                            errorCode: "NOTPEND",
                                            transactionData: t,
                                            transactionDataIsLoaded: true,
                                        }
                                    })
                                    return;
                                }

                            }

                            dispatch({ type: "transaction/setdata", payload: { transactionData: t } })

                        }).catch(err => {

                            dispatch({
                                type: "transaction/seterror",
                                payload: {
                                    error: "No se pudo obetener la transaccion",
                                    errorCode: err.message,
                                    transactionData: {},
                                    transactionDataIsLoaded: false,
                                }
                            })
                        })


                    SignalRService.GetAllRejectCodes()
                        .then((c) => {
                            logger.info("RESULT RJCT CODES", c);

                            if (c == null) {
                                logger.error(c.err);
                                throw new Error(c.err);
                            }


                            dispatch({
                                type: "transaction/setcodes",
                                payload: { codes: c }
                            })

                        }).catch(err => {

                            dispatch({
                                type: "transaction/seterror",
                                payload: {
                                    error: "No se pudo obtener codigos de rechazo",
                                    errorCode: err.message,
                                    transactionData: {},
                                    transactionDataIsLoaded: false,
                                }
                            })
                        })


                }).catch(err => {

                    logger.error(err);

                    dispatch({
                        type: "transaction/seterror",
                        payload: {
                            error: "No se pudo conectar con signalr",
                            errorCode: err.message,
                            transactionData: {},
                            transactionDataIsLoaded: false,
                        }
                    })
                })

            return;
        }


        setLoadModalMessage("")
        setOpenLoadModal(false);


        if (dataIsLoaded) {
            SignalRService.notificationSub = onNotify;
            SignalRService.onReconnectedSub = onReconnected;

            setIsBs(transactionState.transactionData.amount.currency == "VES")

            return () => { SignalRService?.Stop() };
        }



    }, [dataIsLoaded])



    logger.log("Renderizo CheckoutComponent with data:", transactionState.transactionData)


    return (
        <>

            <div className='bg-transparent w-full h-screen flex justify-center items-center rounded-md shadow-md'>

                <main className='relative bg-main-bg flex flex-col  md:flex-row w-full h-full max-w-[1920px] overflow-x-hidden overflow-y-auto'>


                    <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 
                    transition-all ease-in-out duration-500 
                     ${!transactionState.isLoaded() || transactionState.isError ? "opacity-100" : "opacity-0"}
                     ${transactionState.isError ? "-translate-y-[300%] md:-translate-y-[350%]" : "-translate-y-1/2"}`}>
                        <div className="w-[350px] md:w-[560px] h-auto">
                            <Logo negative={true} />
                        </div>
                    </div>

                    <section className={`w-full  md:w-[50%] h-full`}>

                        <div className={`w-full h-full transition-all ease-in-out duration-700
                            
                          
                            ${transactionState.isLoaded() && !transactionState.isError ?
                                visebleTranslateEffect + " opacity-100" : effectTranslateOne + " opacity-0"}`}>

                            {transactionState.isLoaded() && !transactionState.isError
                                && <SendingUserData
                                    isBs={isBs}
                                    setIsBs={setIsBs}
                                    userName={""}
                                    userDocument={getSendingUserId(transactionState)}
                                    concept={transactionState.transactionData?.concept}
                                    monto={FormatAsFloat(convertCurrency(transactionState.transactionData?.amount?.amt,
                                        transactionState.transactionData?.amount?.currency, isBs, transactionState.bcvRates))}
                                    rate={FormatAsFloat(getRate(transactionState.bcvRates))}
                                    backUrl={transactionState.transactionData?.notification_urls?.return_front_end_url}
                                    products={[]}
                                />}

                        </div>




                    </section>

                    <section className={`w-full h-full md:w-[50%] flex 
                flex-col justify-center items-center   ${transactionState.isError ? "hidden" : "block"}
                bg-main-bg-secundary py-8 rounded-t-[1.75rem] md:rounded-none md:rounded-l-[3.5rem] transition-all ease-in-out  duration-700 
                            ${transactionState.isLoaded() && !transactionState.isError ? visebleTranslateEffect +
                            " opacity-100" : effectTranslateTwo + " opacity-100"}`}>

                        <div className="hidden w-[380px] h-auto mb-8 md:block">
                            <Logo />
                        </div>

                        <div className={`w-full `} >
                            {transactionState.isLoaded() && !transactionState.isError &&
                                <PayUserDataForm
                                    banks={transactionState.banks}
                                    receivingUser={transactionState.transactionData?.receiving_user}
                                    amount={transactionState.transactionData?.amount}
                                    onSubmit={onSubmitPayForm}
                                    isBlueprint={isBlueprint}
                                    transactionId={transactionId}

                                />}
                        </div>

                    </section>

                </main>

                <a className="w-0 h-0 opacity-0" ref={linkRef} href={"/"}></a>
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
                    timerTime={30}
                    isBlueprint={isBlueprint}
                    transactionId={transactionId}
                    transactionData={receptSubmitData}
                    onSubmitOtpEvent={onSubmitOtp}
                    onError={(err) => {
                        setOpenOtp(false)
                        openAlertNotification("error", "Error al solicitar el token por favor intente nuevamente")
                    }}
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
                refInternal={notificationState.refInternal}

                onClickEvent={() => {
                    dispatchNotification({ type: "notification/close" });

                    let callBack = transactionState.transactionData?.notification_urls?.return_front_end_url;


                    linkRef.current.href = callBack;
                    linkRef.current.click();

                    return;

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