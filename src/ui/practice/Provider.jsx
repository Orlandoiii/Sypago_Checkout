import { createContext, useReducer } from "react";

export const ContextApi = createContext();


function reducerMiddleware(reducer, initialState, middleware) {

    const [state, dispatch] = useReducer(reducer, initialState);


    const dispatchMiddleware = (action) => {
        middleware(state, dispatchMiddleware)(state)(action)(dispatch);
    }


    return [state, dispatchMiddleware];
}


export const Provider = ({ middleware, reducer, initialState, children }) => (
    <ContextAPI.Provider value={reducerMiddleWare(reducer, initialState, middleware)}>
        {children}
    </ContextAPI.Provider>
)

export const useStateProvider = () => useContext(ContextAPI)
