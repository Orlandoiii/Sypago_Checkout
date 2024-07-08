import { useEffect, useRef } from "react"
import { motion, useDragControls, useMotionValue, useAnimate } from 'framer-motion'
import useMeasure from "react-use-measure";
import logger from "../../../logic/Logger/logger";
import Backdrop from "../modal/Backdrop";

export default function DraggableBox({ children, open, onClose, topStickyChild, closeFromInside = false }) {

    const [scope, animate] = useAnimate();

    const [drawerRef, { height }] = useMeasure();

    const controls = useDragControls();

    const y = useMotionValue(0);

    const dragDuration = useRef({ init: {}, finish: {} })

    const dragPosition = useRef({ init: {}, finish: {} })

    async function handleClose() {

        const yStart = typeof y.get() === "number" ? y.get() : 0;

        animate("#drawer", {
            y: [yStart, height],
        })

        await animate(scope.current, {
            opacity: [1, 0],
        })

        if (onClose)
            onClose();
    }

    useEffect(() => {
        if (closeFromInside)
            handleClose();

    })
    return (
        <>
            {open &&
                <Backdrop outRef={scope}>
                    <motion.div
                        id="drawer"
                        ref={drawerRef}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                        onDragStart={(_, info) => {
                            logger.log("DRAG START", info);

                            dragDuration.current.init = new Date();
                            dragPosition.current.init = info;
                        }}
                        onDragEnd={(_, info) => {

                            logger.log("DRAG END", info);
                            dragDuration.current.finish = new Date();
                            dragPosition.current.finish = info;

                            const toLowCondition = y.get() >= height / 2.5;

                            const toFastCondition = (y.get() < 200 &&
                                dragDuration.current.finish - dragDuration.current.init < 300)

                            const upDirectionCondition = dragPosition.current.init.point.y > dragPosition.current.finish.point.y;

                            if (upDirectionCondition)
                                return;

                            if (toLowCondition || toFastCondition) {

                                handleClose();
                            }
                        }}
                        drag="y"
                        dragControls={controls}
                        dragListener={false}
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 1 }}
                        style={{ y }}
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-0 w-full h-[60vh] bg-[whitesmoke]  
                     rounded-t-3xl  overflow-hidden">

                        <button
                            type="button"
                            className="group/drag h-[45px] w-full flex justify-center p-4 shadow-sm 
                    cursor-grab touch-none active:cursor-grabbing"
                            onPointerDown={(e) => {
                                controls.start(e);
                            }}>
                            <div className="h-[5px] w-[60px] bg-slate-300 rounded-full 
                        group-active/drag:bg-slate-400 group-hover/drag:bg-slate-400 duration-200"></div>
                        </button>

                        <div className="relative h-auto w-full">
                            {topStickyChild}
                        </div>
                        <div className="h-full overflow-y-auto p-4">
                            {children}
                        </div>

                    </motion.div>
                </Backdrop>}
        </>

    )

}