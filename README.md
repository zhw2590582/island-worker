# island-worker [![Build Status](https://www.travis-ci.org/zhw2590582/island-worker.svg?branch=master)](https://www.travis-ci.org/zhw2590582/island-worker) [![Coverage Status](https://coveralls.io/repos/github/zhw2590582/island-worker/badge.svg?branch=master)](https://coveralls.io/github/zhw2590582/island-worker?branch=master)

> An utility of web workers

## Install

```
$ npm install island-worker
```

## Usage

```js
import IWorker from 'island-worker';

// By default, a worker named 'default' is created
var workers = new IWorker(args => {
    return args[0];
});

// By default execute a worker named 'default'
workers.run(['default']).then(console.log).catch(console.error);

// Or use async/await
// (async () => {
//     console.log(await workers.run(['default']));
// })();

// Add a custom worker
workers.add('custom', args => {
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
    workers.run(['kill default']).then(console.log).catch(console.error);
}, 400);

// Stop a custom worker
setTimeout(() => {
    workers.kill('custom');
    workers.run(['kill custom']).then(console.log).catch(console.error);
}, 600);

// Stop all workers
setTimeout(() => {
    workers.killAll();
    workers.runAll(['kill all']).then(console.log).catch(console.error);
}, 800);
```

## Related

- [simple-web-worker](https://github.com/israelss/simple-web-worker) - An utility to simplify the use of web workers

## License

MIT © [Harvey Zack](https://www.zhw-island.com/)
