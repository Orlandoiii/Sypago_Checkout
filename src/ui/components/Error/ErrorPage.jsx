import logger from "../../../logic/Logger/logger";
import { ErrorInternal } from "../../core/error/ErrorPage";

export default function ErrorPage({ }) {

    const error = useRouteError();

    logger.error(error)

    let message = "";

    if (error?.statusTest || error?.message) {
        message = `${error?.statusTest} ${error?.message}`
    }

    return (
        <ErrorInternal code={"500"} message={message} />
    )

}