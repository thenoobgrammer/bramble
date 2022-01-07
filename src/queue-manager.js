class QueueManager {
    constructor() {
        if(QueueManager.instance instanceof QueueManager) {
            return QueueManager.instance;
        }

        this.attr = {
            queue: new Map()
        }

        QueueManager.instance = this;
    }

    get(key) {
        return this.attr[key];
    }

}
module.exports = {
    QueueManager
};