export default class AcceptError {
    constructor(message, errorType, associateException) {
        this.message = message;
        this.errorType = errorType;
        this.associateException = associateException;
    }

    static GenerateAcceptError(v) {
        const acceptErr = new AcceptError(v?.message, v?.errorType, v?.associateException);
        return acceptErr;
    }

    GetErrorMessage() {
        switch (this.errorType) {
            case 1:
                return "RATECHANGE"
            case 2:
                return "FORMATERR"
        }

        return "UNKNOW"
    }
}