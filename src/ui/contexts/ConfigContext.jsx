import { createContext, useContext, useEffect, useReducer } from "react";
import { LoadModalController } from "../controllers/LoadModalController";
import logger from "../../logic/Logger/logger";

const configInitialState = {
    isLoaded: false,
    configValue: null,
    err: null
}




async function LoadConfig() {

    const host = window.location.origin;

    //logger.info("Config host/origin:", host);

    //let configRequest = await fetch(import.meta.env.BASE_URL + '/config.json');


    let configRequest = await fetch("http://localhost:5173" + '/config.json');



    logger.info("Config Request:", configRequest);

    let configJson = await configRequest.json();

    logger.info("Config JSON::", configJson);

    configJson.host = host;

    return { config: configJson, success: true };

}


const ConfigContext = createContext();

function reducer(state, action) {

    switch (action.type) {

        case "config/update":
            return { ...state, configValue: action.config, isLoaded: true }

        case "config/error":
            return { ...state, error: action.err, isLoading: false }

        default:
            return state
    }
}

export default function ConfigContextProvider({ children }) {

    const [state, dispatch] = useReducer(reducer, configInitialState);

    logger.log(state);

    useEffect(() => {
        LoadModalController.openModal();

        const fetchConfig = async () => {
            let c = await LoadConfig()

            if (c.success) {
                dispatch({ type: "config/update", config: c.config });
                LoadModalController.closeModal();
            } else {
                dispatch({ type: "config/error", err: c.err });
            }

        };
        fetchConfig();
    }, [])

    return (
        <ConfigContext.Provider value={{ config: state.configValue }}>
            {state.isLoaded && children}
        </ConfigContext.Provider>
    )
}


export function useConfig() {
    return useContext(ConfigContext);
}





