import { createContext, useContext, useRef, useState } from "react";
import NotificationModal from "../core/notifications/NotificationModal";

export const NotificationModalContext = createContext({
    showNotification: (refBanco, refSypago, montoCobrado,
        montoPagado, codigo, operationResult, typeOfNotification) => { },
    closeNotification: () => { },
    registerOnClickCallback: (onClickHandler) => { }
});



export default function NotificationModalContextProvider({ children }) {

    const [open, setOpen] = useState(false);

    const [refSypago, setRefSypago] = useState("");

    const [refBanco, setRefBanco] = useState("");

    const [montoCobrado, setMontoCobrado] = useState("")

    const [montoPagado, setMontoPagado] = useState("");

    const [codigo, setCodigo] = useState("");

    const [operationResult, setOperationResult] = useState("PROC");

    const [typeOfNotification, setTypeOfNotification] = useState("INFO")

    const onClickHandlerRef = useRef(null);

    function showNotification(refBanco, refSypago, montoCobrado,
        montoPagado, codigo, operationResult, typeOfNotification) {

        if (refSypago && refSypago !== "") {
            setRefSypago(refSypago);
        }
        if (refBanco && refBanco !== "") {
            setRefBanco(refBanco);
        }
        if (montoCobrado && montoCobrado !== "") {
            setMontoCobrado(montoCobrado);
        }
        if (montoPagado && montoPagado !== "") {
            setMontoPagado(montoPagado);
        }
        if (codigo && codigo !== "") {
            setCodigo(codigo);
        }
        if (operationResult && operationResult !== "") {
            setOperationResult(operationResult);
        }
        if (typeOfNotification && typeOfNotification !== "") {
            setTypeOfNotification("");
        }

        setOpen(true);
    }

    function closeNotification() {
        setOpen(false);
    }

    function registerOnClickCallback(onClickHandler) {
        if (onClickHandler)
            onClickHandlerRef.current = onClickHandler;
    }

    return (
        <NotificationModalContext.Provider value={{
            showNotification: showNotification,
            closeNotification: closeNotification,
            registerOnClickCallback: registerOnClickCallback
        }}>

            {children}

            <NotificationModal
                open={open}
                onClickEvent={() => {
                    if (onClickHandlerRef.current)
                        onClickHandlerRef.current()
                }}
                typeOfNotification={typeOfNotification}
                operationResult={operationResult}
                codigo={codigo}
                montoCobrado={montoCobrado}
                montoPagado={montoPagado}
                refSypago={refSypago}
                refBanco={refBanco} />

        </NotificationModalContext.Provider>
    )
}


export function useNotificationModal() {
    const context = useContext(NotificationModalContext);

    if (!context)
        throw new Error("no context provider for useNotificationModal");

    return context;
}