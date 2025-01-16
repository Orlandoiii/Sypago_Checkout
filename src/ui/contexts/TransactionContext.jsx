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
    3: "RJCT",
    4: "CANC"

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


    errorCode: "",
    isError: false,
    error: null,

    statusMessage: null,
    originalMessageStatus: null,
    hash: null
};

function createCodeDescriptionDictionary(data) {
    const dictionary = {};

    data.forEach(item => {
        const parsedItem = JSON.parse(item);
        dictionary[parsedItem.code] = parsedItem.description;
    });

    return dictionary;
}

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
            
            //console.log("action.payload.transactionData", action.payload.transactionData)
            
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
                rjctCodes: createCodeDescriptionDictionary(action.payload.codes),
                rjctCodeLoad: true
            }
        }

        case "transaction/seterror": {
            return {
                ...state,
                error: action.payload.error,
                isError: true,
                errorCode: action.payload.errorCode,
                transactionData: action.payload.transactionData,
                transactionDataIsLoaded: action.payload.transactionDataIsLoaded
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