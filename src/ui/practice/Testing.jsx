
// function sum(a, b, c) {
//     return a + b + c;
// }

// function sumCurried(a) {
//     return function (b) {
//         return function (c) {
//             return a + b + c;
//         }
//     }
// }

// const curriedArrow = (a) => (b) => (c) => a + c + b;


// console.log(curriedArrow(10)(2)(1));

// const counterInitialState = {
//     count: 0,
//     stepper: 5,
// }


// function reducerCounter(state, action) {

//     switch (action.type) {
//         case "counter/inc":
//             return { ...state, count: state.count + action.payload }
//     }

//     return state
// }


// function CounterUseReducer({ }) {

//     const [countState, dispatch] = useReducer(reducerCounter, counterInitialState)

//     return (
//         <div className="">
//             <h2>Counter Reducer</h2>
//             <h3>{countState?.count}</h3>
//             <h3>Stepper:{countState.stepper}</h3>
//             <button onClick={() => dispatch({ type: "counter/inc", payload: 3 })}>Incrementar +</button>
//         </div>
//     )
// }

// function InnerComponent({ }) {

//     const { showNotification, closeNotification, registerOnClickCallback } = useNotificationModal();

//     const { openLoadModal, closeLoadModal } = useLoadModal();

//     registerOnClickCallback(() => {
//         closeNotification();
//     });

//     return (
//         <>

//             <div className="">
//                 <button onClick={(e) => {
//                     showNotification("0022447788", "MLJ558844", "10", "5,55", "AM02", "RJCT")
//                 }}
//                     className="bg-primary text-white p-4 rounded-md shadow-sm">Open Modal Notification</button>

//                 <button onClick={(e) => {
//                     openLoadModal("Mensaje");
//                     setTimeout(() => {
//                         closeLoadModal();
//                     }, 5500)
//                 }}
//                     className="bg-primary text-white p-4 rounded-md shadow-sm">Click Load Modal</button>
//             </div>

//         </>



//     )
// }


// function Testing({ }) {
//     const [openModal, setOpenModal] = useState(false);

//     const [openDetail, setOpenDetail] = useState(false)

//     return (
//         <>
//             <NotificationModalContextProvider>
//                 <LoadModalContextProvider>

//                     <CounterUseReducer />
//                     <div className="w-full h-screen flex flex-col justify-center items-center py-8">
//                         <div className="w-full max-w-[360px] md:max-w-[440px] h-full">
//                             <PayUserDataForm />
//                             <Modal open={openModal} onClose={() => setOpenModal(false)} showX={true}>
//                                 <OtpForm otpLen={8} />
//                             </Modal>
//                         </div>
//                         <button onClick={(e) => { setOpenModal(true) }} className="bg-primary text-white p-4 rounded-md shadow-sm">Open Modal</button>
//                         <InnerComponent />
//                         <DetailConfirmation open={openDetail} onClose={() => { setOpenDetail(false) }} />
//                     </div>
//                 </LoadModalContextProvider>

//             </NotificationModalContextProvider>
//         </>
//     )
// }
