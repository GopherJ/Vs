const URL = window.URL || window.webkitURL;

/**
 *
 * @param task
 * @return {Blob}
 */
const blobWorker = task => {
    return new Blob([`
        self.onmessage = event => {
            const args = event.data.args; 
            self.postMessage((${task}).apply(null, args));
        } 
    `], { type: 'application/javascript' });
};

/**
 *
 * @param task
 * @constructor
 */
function TinyWorker(task) {
    this.objectURL = URL.createObjectURL(blobWorker(task));
    this.worker = new Worker(this.objectURL);
}

TinyWorker.prototype.update = function (task) {
    URL.revokeObjectURL(this.objectURL);

    this.objectURL = URL.createObjectURL(blobWorker(task));
    this.worker = new Worker(this.objectURL);

    return this;
};

TinyWorker.prototype.run = function (args = []) {
    return new Promise((resolve, reject) => {
        this.worker.onmessage = event => {
            return resolve(event.data);
        };

        this.worker.onerror = event => {
            return reject(event);
        };

        this.worker.postMessage({ args });
    });
};

TinyWorker.prototype.destroy = function () {
    URL.revokeObjectURL(this.objectURL);

    this.worker.terminate();
};


export default TinyWorker;





