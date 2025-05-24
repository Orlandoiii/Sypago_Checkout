import * as SignalR from '@microsoft/signalr';
import logger from '../Logger/logger';

export async function Wait(miliseconds = 1000) {

    let resolve = {};

    let p = new Promise(r => {
        resolve = r;
    })

    setTimeout(() => {
        resolve(true);
    }, miliseconds);

    return p;
}

class SignalRCom {



    connection = null;
    hubUrl = '';

    requestAlredyInit = {
        alredyAsk: false,
        lastRequest: Date.now(),
    };

    notificationSub = null;

    onReconnectionSub = null;

    onReconnectedSub = null;


    onCloseSub = null;


    constructor() {

    }

    async Stop() {

        try {
            await this.
            connection.
            stop();
        } catch (err) {
            logger.error(err);
        } finally {
            this.connection = null;
        }
    }

    async Init(hubUrl) {
        let retry = 0;

        let errList = [];

        let sucess = false;

        while (retry < 8 && !sucess) {


            await Wait(retry * 1500);
            retry++

            try {

                if (!this.hubUrl || this.hubUrl === '') {
                    this.hubUrl = hubUrl;
                }

                if (this.connection) {
                    await this.Stop();
                }

                this.connection = new SignalR.HubConnectionBuilder().withUrl(this.hubUrl, {
                        skipNegotiation: true,
                        transport: SignalR.HttpTransportType.WebSockets
                    })
                    .withAutomaticReconnect()
                    .configureLogging(SignalR.LogLevel.Warning) // Optional for debugging
                    .build();



                await this.connection.start();



                let counter = 0;

                while (this.connection.state !=
                    SignalR.HubConnectionState.Connected &&
                    counter < 1000) {

                    let wait = new Promise((res, _) => {
                        setTimeout(() => {
                            res("end");
                        }, 250)
                    })

                    await wait;
                    counter++;
                }


                let result = await this.connection.invoke("Ping");

                if (!result) {
                    errList.push(new Error("no se pudo realizar ping contra el servidor"));
                    continue;
                }

                sucess = true

            } catch (err) {
                logger.error("error establexiendo conexion signalR", err);
                errList.push(err);
                sucess = false;
            }

        }

        if (!sucess) {
            throw new Error("se agotaron los reintentos de conexion");
        }

        this.connection.onreconnecting(error => {
            if (this.onReconnectionSub)
                this.onReconnectionSub(error);
        });

        this.connection.onreconnected(connectionId => {
            if (this.onReconnectedSub)
                this.onReconnectedSub()
        });

        this.connection.onclose(error => {
            if (this.onCloseSub)
                this.onCloseSub()
        })

        this.connection.on("NotifyExternalApi", (result, hash) => {
            if (this.notificationSub)
                this.notificationSub(result, hash);
        });

        return "Conexion Ejecutada exitosamente";


    }

    async GetTransaction(transactionId, isBlueprintOperation = false) {

        try {

            let methodName = 'GetTransaction';

            if (isBlueprintOperation) {
                methodName = 'GetTransactionBlueprint'
            }

            let result = await this.connection.invoke(methodName, transactionId);

            return result;
        } catch (err) {

            logger.error(err);
            throw err;
        }

    }

    async GetAllBanks() {
        try {
            let result = await this.connection.invoke("GetAllBanks");
            return result;
        } catch (err) {

            logger.error(err);
            throw err;
        }
    }

    async GetAllRejectCodes() {
        try {
            let result = await this.connection.invoke("GetAllRejectCodes");
            return result;
        } catch (err) {

            logger.error(err);
            throw err;
        }
    }

    async RequestOtp(transactionId, payAmt, receptUser, receptDocumentType, isBlueprintOperation = false) {
        try {

            const currentTime = Date.now();
            const elapsedTimeInSeconds = (currentTime - this.requestAlredyInit.lastRequest) / 1000;

            if (this.requestAlredyInit.alredyAsk && elapsedTimeInSeconds < 5) {
                return { isSuccessful: true };
            }

            this.requestAlredyInit.alredyAsk = true;
            this.requestAlredyInit.lastRequest = Date.now();


            let methodName = "RequestOtp";

            if (isBlueprintOperation)
                methodName = "RequestOtpBlueprint"

            let result = await this.connection.invoke(methodName, transactionId, payAmt, receptUser, receptDocumentType);

            return result;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

    async AcceptTransaction(transactionId, payAmt, receptUser, otp, isBlueprintOperation = false) {
        try {

            let methodName = 'AcceptCheckoutTransactionExternal';

            if (isBlueprintOperation) {
                methodName = 'AcceptLinkWithBlueprint'
            }


            let result = await this.connection.invoke(methodName,
                transactionId, payAmt, receptUser, otp);
            return result;
        } catch (err) {
            logger.error(err);
            throw err;
        }
    }

}



export const SignalRService = new SignalRCom();

export default SignalRCom;