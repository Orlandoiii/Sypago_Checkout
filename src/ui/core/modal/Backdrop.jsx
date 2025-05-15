import { motion } from "framer-motion"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const backDropAnimation = {

    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
    },
    exit: {
        opacity: 0
    }
}

export default function Backdrop({ children, outRef, backGround = "bg-black/30" }) {


    const [parenNode, setParentNode] = useState(null);

    useEffect(() => {
        const node = document.querySelector("#backdrop-root");
        setParentNode(node)
    }, [])


    return (
        <>
            {parenNode && createPortal(
                <motion.div
                    variants={backDropAnimation}
                    initial={"hidden"}
                    animate={"visible"}
                    transition={{ ease: "easeInOut" }}
                    exit={"exit"}
                    id="Backdrop"
                    ref={outRef}
                    className={`fixed inset-0 ${backGround} h-full w-full overflow-hidden overscroll-none z-40 flex justify-center items-center`}>
                    {children}
                </motion.div>, parenNode)}
        </>
    )
}