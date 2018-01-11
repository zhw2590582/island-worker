export default class IWorker {
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
         const args = event.data.message
         if (args) {
            return self.postMessage((${fn}).call(null, args))
           // return close()
         }
         return self.postMessage((${fn})())
         // return close()
       }
     `;
  }

  _create(fn) {
    const URL = window.URL || window.webkitURL;
    const blob = new Blob([this._toCode(fn)], {
      type: 'application/javascript'
    });
    const objectURL = URL.createObjectURL(blob);
    const worker = new Worker(objectURL);
    worker.post = message =>
      new Promise((resolve, reject) => {
        worker.onmessage = event => {
          // URL.revokeObjectURL(objectURL);
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

  run(name, args) {
    if (Array.isArray(name)) {
      args = name;
      name = 'default';
    }
    if (typeof name !== 'string') {
      throw new TypeError(`The first parameter is not a string`);
    }
    if (!Array.isArray(args)) {
      throw new TypeError(`The second parameter is not an array`);
    }
    if (!this.workers.has(name)) {
      throw new TypeError(`You have not registered this worker: '${name}'`);
    }
    let worker = this.workers.get(name);
    return worker.post(args);
  }

  runAll(args) {
      let workers = [];
      this.workers.forEach(worker => {
        workers.push(worker.post.bind(worker, args));
      });
      return this._runPromisesInSeries(workers);
  }

  kill(name = 'default', signal) {
    let worker = this.workers.get(name);
    this.run(name, { type: 'KILL', signal }).then(worker.terminate);
  }

  killAll(){

  }

  add(name, fn) {
    if (typeof name !== 'string') {
      throw new TypeError(`The first parameter is not a string`);
    }
    if (this.workers.has(name)) {
      throw new TypeError(`You already use the same name '${name}' of worker`);
    }
    if (typeof fn !== 'function') {
      throw new TypeError(`The second parameter is not a function`);
    }
    this.workers.set(name, this._create(fn));
  }

  /**
   * ================================== HELPER ==================================
   */

  _runPromisesInSeries(ps) {
    ps.reduce((p, next) => p.then(next), Promise.resolve());
  }
}

window.IWorker = IWorker;
