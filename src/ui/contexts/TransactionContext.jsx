import { createContext, useContext, useReducer } from "react";


export const paymentNameToNumber = {
    PEND: 0,
    PROC: 1,
    ACCP: 2,
    RJCT: 3,
    CANC: 4

}


export const paymentNumberToName = {
    0: "PEND",
    1: "PROC",
    2: "ACCP",
    4: "RJCT",
    5: "CANC"

}



const transactionInitialState = {

    transactionId: "",
    blueprintId: "",
    isBlueprintTransaction: false,

    transactionData: null,
    transactionDataIsLoaded: false,

    paymentStatus: 'PEND',
    notification: null,
    isLoaded() {
        return this.rjctCodeLoad && this.banksLoads && this.transactionDataIsLoaded;
    },
    isPaying: false,
    isWaitingForNotification: false,
    acceptError: null,

    banks: [],
    banksLoads: false,


    rjctCodes: null,
    rjctCodeLoad: false,

    isError: false,
    error: null,

    statusMessage: null,
    originalMessageStatus: null,
    hash: null
};



export const transactionReducer = (state, action) => {


    switch (action.type) {

        // case "transaction/loadingdata": {
        //     return { ...state, transactionData: null, isLoaded: false }
        // }

        case "transaction/settoblueprint":
            return {
                ...state,
                transactionId: "",
                blueprintId: action.payload.blueprintId,
                isBlueprintTransaction: true,
            }
        case "transaction/settotransaction":
            return {
                ...state,
                transactionId: action.payload.transactionId,
                blueprintId: "",
                isBlueprintTransaction: false,
            }
        case "transaction/setdata": {
            return {
                ...state,
                transactionData: action.payload.transactionData,
                transactionDataIsLoaded: true,
                paymentStatusDict: action.payload.transactionData.status
            }
        }

        case "transaction/process": {
            return {
                ...state,
                paymentStatus: "PROC"
            }
        }


        case "transaction/status": {
            return {
                ...state,
                statusMessage: action.payload.status,
                paymentStatus: paymentNumberToName[action.payload.status.TxSts],
                hash: action.payload.hash,
                originalMessageStatus: action.payload.original
            }
        }

        case "transaction/setbanks": {
            return {
                ...state,
                banks: action.payload.banks,
                banksLoads: true
            }
        }

        case "transaction/setcodes": {
            return {
                ...state,
                rjctCodes: action.payload.codes,
                rjctCodeLoad: true
            }
        }

        case "transaction/seterror": {
            return {
                ...state,
                error: action.payload.error,
                isError: true,
            }
        }



        // case "transaction/setloaded": {
        //     return {
        //         ...state,

        //         isLoaded: !state.isLoaded
        //     }
        // }
    }
    return state;
}

const TransactionContext = createContext();


export default function TransactionContextProvider({ children }) {
    const [state, dispatch] = useReducer(transactionReducer, transactionInitialState);

    return (
        <TransactionContext.Provider value={{ transactionState: state, dispatch }}>
            {children}
        </TransactionContext.Provider>
    )
}


export function useTransaction() {
    return useContext(TransactionContext);
}