import EventEmitter from "events"
import logger from "../../logic/Logger/logger";

class LoadingModalNotificationService {
    constructor() {
        this.eventEmitter = new EventEmitter();
    }

    onOpen(callback) {
        this.eventEmitter.on('open', callback);
    }

    onClose(callback) {
        this.eventEmitter.on('close', callback);
    }

    openModal(message) {

        this.eventEmitter.emit('open', message);
    }

    closeModal() {
        this.eventEmitter.emit('close');
    }
}

export const LoadModalController = new LoadingModalNotificationService();