import express, { Response } from 'express';
import { autoPublishLog, bindLog, Config, stackLog, Step } from 'ts-logs';
import FindProduct from './use-case/find-product.use-case';
import Login from './use-case/login.use-case';
import MainUseCase from './use-case/main.use-case';
import Payment from './use-case/payment.use-case';

// provide by config for s3
const bucketName = process.env.Bucket!;
const accessKeyId = process.env.accessKeyId!;
const secretAccessKey = process.env.secretAccessKey!;
const region = process.env.region! as any;
const config = Config.S3({ bucketName, region, credentials: { accessKeyId, secretAccessKey } });
const payment = new Payment();
const login = new Login();
const product = new FindProduct();
const main = new MainUseCase(login, product, payment);

const app = express();
app.use(express.json());

// bind Global log to request
app.use(bindLog());

// automatically publish logs
app.use(autoPublishLog(config));

app.post('/domain', async (req, res): Promise<Response> => {
    const result = await main.execute(req.body);
    if (result.isFail()) {
        req?.log?.addStep(result.error());
        req?.log?.print(); // show error on terminal
        req?.log?.writeLocal(); // write local on /logs
        return res.status(400).json(req.log);
    }
    return res.status(200).json({ ok: true });
});

// chain middleware applying steps for each one
app.post('/chain', (req, res, next): void => {

    // STEP 1
    const tags = ["chain", "log", "middleware"];
    const step = Step.info({ name: 'Chain Step 1', message: 'Passed for step 1', tags });
    req.log?.addStep(step);
    next();

}, (req, res, next): void => {

    // STEP 2
    const err = new Error("oops timeout. Error!");
    const step = Step.catch(err);
    req.log?.addStep(step);
    next();

}, (req, res, next): void => {

    // STEP 3
    const step = Step.error({ name: 'Chain Step 3', message: 'Something fails on step 2', statusCode: 400 });
    req.log?.addStep(step);
    next();

}, (req, res, next): void => {

    // STEP 4
    const step = Step.stack({ name: 'Chain Step 4', message: 'Error in step 4', stack: 'Something went wrong!', statusCode: 500 });
    req.log?.addStep(step);
    next();

}, async (req, res, next): Promise<Response> => {

    // STEP 5
    const step = Step.warn({ message: 'Remember check some', name: 'Important' });
    req.log?.addStep(step)
    req.log?.writeLocal();

    await req.log?.publish(config);

    return res.status(200).json(req.log);

});

app.post('/', (req, res): void => {
    throw new Error('Forbidden Resource');
});

app.get('/ok', (req, res): void => {
    res.status(200).json(req.log);
});

app.get('/success', (req, res): void => {
    res.status(200).json(req.log);
});

app.get('/fail', (req, res): never => {
    throw new Error('Internal Server Error');
});

app.post('/error', (req, res): never => {
    throw new Error('Internal Server Error');
});

// intercept app error
app.use(stackLog({
    print: true,
    writeLocal: true,
    encrypt: false,
    sendAsResponse: true,
    remove: ["password", "card", "token"]
}));

app.listen(3000, (): void => console.log('running on http://localhost:3000'));
