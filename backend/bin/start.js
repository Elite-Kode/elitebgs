#!/usr/bin/env node
"use strict";

const cluster = require('cluster')
const os = require('os')

if (cluster.isMaster) {
    // const cpus = ( os.cpus().length > 1 ) ? os.cpus().length / 2 : 1

    const cpus = 1


    console.log("Scaling to ${cpus} worker processes")

    for (let i = 0; i < cpus; i++) {
        cluster.fork();
    }

    console.dir(cluster.workers, { depth: 0 });

    // initialize our CLI 
    process.stdin.on('data', (data) => {
        initControlCommands(data);
    })

    // respawn if a worker process dies
    cluster.on('exit', (worker, code) => {
        if (code !== 0 && !worker.exitedAfterDisconnect) {
            console.log(`\x1b[34mWorker ${worker.process.pid} crashed.\nStarting a new worker...\n\x1b[0m`);
            const nw = cluster.fork();
            console.log(`\x1b[32mWorker ${nw.process.pid} will replace him \x1b[0m`);
        }
    });

    console.log(`Parent PID: ${process.pid}`)
} else {
    /**
     * Module dependencies.
     */
    let app = require('../server');
    let http = require('http');

    /**
     * Get port from environment and store in Express.
     */

    let port = normalizePort(process.env.PORT || '3010');
    app.set('port', port);

    /**
     * Create HTTP server.
     */

    let server = http.createServer(app);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */

    function normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        let bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */

    function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log(`Listening to ${bind}`);
        console.log('Environment: ' + app.get('env'));
    }
}

