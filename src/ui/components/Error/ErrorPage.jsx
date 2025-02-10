import logger from "../../../logic/Logger/logger";
import { ErrorInternal } from "../../core/error/ErrorPage";
import { useRouteError } from "react-router-dom";

export default function ErrorPage({}) {

    const error = useRouteError();

    logger.error(error)


    let message = "";

    if (error?.statusText || error?.message) {
        message = `${error?.statusText} ${error?.message}`
    }

    return (
        <ErrorInternal code={"500"} message={message} />
    )

}