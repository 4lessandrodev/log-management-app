import https, { RequestOptions } from 'node:https';
import http from 'node:http';
import { Log, Step } from 'ts-logs';

const log = Log.init({ name: 'Test' });
log.addStep(Step.create({}));

const data = JSON.stringify(log);

const url = new URL('http://localhost:3001/test-002');

const options: RequestOptions = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    method: 'POST',
    protocol: url.protocol,
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
    },
}

const isHttps = url.protocol === 'https:' || url.port === '443' || url.href.includes('https://');

const request = isHttps ? https.request(options) : http.request(options);

request.write(data);
request.end();
