import express from 'express';
import { bindLog, stackLog } from 'ts-logs';
import FindProduct from './use-case/find-product.use-case';
import Login from './use-case/login.use-case';
import MainUseCase from './use-case/main.use-case';
import Payment from './use-case/payment.use-case';

const payment = new Payment();
const login = new Login();
const product = new FindProduct();
const main = new MainUseCase(login, product, payment);

const app = express();
app.use(express.json());

// bind Global log to request
app.use(bindLog());

app.post('/domain', async (req, res) => {
    const log = req.log;
    const result = await main.execute(req.body);
    if(result.isFail()){
        const err = log.addStep(result.error());
        err.print(); // show error on terminal
        err.writeLocal(); // write local on /logs
        return res.status(400).json(err);
    }
    return res.status(200).json({ ok: true });
})

app.post('/', (req, res) => {
    throw new Error('Forbidden Resource');
});

app.get('/ok', (req, res) => {
    res.status(200).json(req.log);
});

app.get('/success', (req, res) => {
    res.status(200).json(req.log);
});

app.get('/fail', (req, res) => {
    throw new Error('Internal Server Error');
});

app.post('/error', (req, res) => {
    throw new Error('Internal Server Error');
});

// intercept app error
app.use(stackLog({ print: true, writeLocal: true, encrypt: false, sendAsResponse: true }));

app.listen(3000, () => console.log('running on http://localhost:3000'));
