import { useEffect } from "react";
import LoadImage from "../img/LoadSypagoImage";
import Backdrop from "./Backdrop";
import { motion, AnimatePresence } from "framer-motion";
import { LoadModalController } from "../../controllers/LoadModalController";

const loadEffects = {
    hidden: {
        opacity: 0,
        scale: 0.5
    },
    visible: {
        opacity: 1,
        scale: 1
    },
    exit: {
        opacity: 0,
        scale: 1.5
    }

}

export default function LoadModal({ open, setOpen, message, setMessage,
    subscribeToController = true, backDropBg = "bg-white/60" }) {



    function openModal(m) {
        setOpen(true)
        setMessage(m)
    }
    function closeModal() {
        setOpen(false)
        setMessage("")
    }


    useEffect(() => {
        if (subscribeToController) {
            LoadModalController.onOpen(openModal);
            LoadModalController.onClose(closeModal);

            return () => {
                LoadModalController.eventEmitter.removeListener("open", openModal);
                LoadModalController.eventEmitter.removeListener("close", closeModal);
            }
        }
    }, [])



    return (

        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}>
            {open &&
                <Backdrop backGround={backDropBg}>
                    <motion.div
                        variants={loadEffects}
                        initial={"hidden"}
                        animate={"visible"}
                        exit={"exit"}
                        transition={{
                            ease: "easeInOut",
                            duration: 0.25
                        }}
                        className="w-45 flex flex-col justify-center items-center" >

                        <h1 className={`text-main-bg text-lg mb-3 font-bold animate-pulse
                            ${message && message != '' ? "opacity-100" : "opacity-0"}`}>{message}</h1>

                        <LoadImage />
                    </motion.div>
                </Backdrop>}
        </AnimatePresence>

    )
}