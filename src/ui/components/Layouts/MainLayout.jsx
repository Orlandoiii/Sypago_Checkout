import { useState } from "react";
import LoadModal from "../../core/modal/LoadModal";
import TransactionContextProvider from "../../contexts/TransactionContext";
import NotificationAlertModalContextProvider from "../../core/notifications/NotificationAlertModal";

export default function MainLayout({ children }) {


    const [openLoadModal, setOpenLoadModal] = useState(false);
    const [messageLoadModal, setMessageLoadModal] = useState("");

    return (
        <>
            <LoadModal
                open={openLoadModal}
                setOpen={setOpenLoadModal}
                message={messageLoadModal}
                setMessage={setMessageLoadModal}
                subscribeToController={true} />

          
                <NotificationAlertModalContextProvider>
                    <TransactionContextProvider>
                        {children}
                    </TransactionContextProvider>
                </NotificationAlertModalContextProvider>

        </>
    )
}