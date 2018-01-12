# island-worker

> An utility of web workers

## Install

```
$ npm install island-worker
```

## Usage

```js
import IWorker from 'island-worker';

// By default, a worker named 'default' is created
var workers = new IWorker(function (args) {
    return args[0];
});

// By default execute a worker named 'default'
workers.run(['default']).then(console.log).catch(console.error);

// Add a custom worker
workers.add('custom', function (args) {
    return args[0];
});

// Execute a custom worker
workers.run('custom', ['custom']).then(console.log).catch(console.error);

// Execute all workers
setTimeout(() => {
    workers.runAll(['runAll']).then(console.log).catch(console.error);
}, 200);

// By default, a worker named 'default' is stopped
setTimeout(() => {
    workers.kill();
    workers.run(['kill']).then(console.log).catch(console.error);
}, 400);

// Stop all workers
setTimeout(() => {
    workers.killAll();
    workers.runAll(['killAll']).then(console.log).catch(console.error);
}, 600);
```

## Related

- [simple-web-worker](https://github.com/israelss/simple-web-worker) - An utility to simplify the use of web workers

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)