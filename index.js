class IWorker {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError(`The first parameter is not a function`);
    }
    this.workers = new Map();
    this.add('default', fn);
  }

  /**
   * ================================== PRIVATE METHODS ==================================
   */

  _toCode(fn) {
    return `
       self.onmessage = event => {
         const args = event.data.message.args
         if (args) {
           self.postMessage((${fn}).apply(null, args))
           return close()
         }
         self.postMessage((${fn})())
         return close()
       }
     `;
  }

  _create(fn) {
    const URL = window.URL || window.webkitURL;
    const blob = new Blob([this._toCode(fn)], { type: 'application/javascript' });
    const objectURL = URL.createObjectURL(blob);
    const worker = new Worker(objectURL);
    worker.post = message =>
      new Promise((resolve, reject) => {
        worker.onmessage = event => {
          URL.revokeObjectURL(objectURL);
          resolve(event.data);
        };
        worker.onerror = e => {
          console.error(
            `Error: Line ${e.lineno} in ${e.filename}: ${e.message}`
          );
          reject(e);
        };
        worker.postMessage({ message });
      });
    return worker;
  }

  /**
   * ================================== PUBLIC METHODS ==================================
   */

  run(args) {
    //
  }

  runAll() {
    //
  }

  kill(name = 'default') {
    this.workers.delete(name);
  }

  killAll() {
    //
  }

  add(name, fn) {
    if (typeof name !== 'string') {
      throw new TypeError(`The first parameter is not a string`);
    }
    if (this.workers.has(name)) {
      throw new TypeError(`You already use the same name '${name}' of worker`);
    }
    if (typeof name !== 'function') {
      throw new TypeError(`The second parameter is not a function`);
    }
    this.workers.push({ name, worker: this._create(fn) });
  }

  /**
   * ================================== HELPER ==================================
   */
}

window.IWorker = IWorker;
module.exports = IWorker;
