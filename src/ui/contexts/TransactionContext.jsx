import { createContext, useContext, useReducer } from "react";

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
                transactionDataIsLoaded: true
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