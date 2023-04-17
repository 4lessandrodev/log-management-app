import axios from "axios";
import { Fail, IUseCase, Ok, Result } from "rich-domain";
import { Method, Step } from "ts-logs";
import { Dto as Product } from './find-product.use-case';
import { Dto as User } from './login.use-case';
import globalLog from "../global-log";


export interface Dto {
    user: User;
    product: Product;
}

axios.interceptors.response.use(async (response) => {
    const name = response.request?.path?.length > 5 ? response.request.path : response.config.url;

    const step = Step.info({
        method: (response.config?.method || 'POST').toUpperCase() as Method,
        url: response.config.url,
        statusCode: response.status,
        name: name,
        message: response.statusText,
        data: {
            request: {
                headers: response.config.headers,
                method: response.config.method,
                url: response.config.url,
                data: response.config.data
            },
            response: {
                data: response.request.res.data,
                status: response.status,
                headers: response.config.headers
            }
        },
        additionalInfo: 'from axios interceptor'
    });

    globalLog.addStep(step);
    return response;
}, async (err) => {

    const name = err.request?.path?.length > 5 ? err.response.path : err.config.url;

    const step = Step.error({
        stack: err.stack,
        method: (err.config.method).toUpperCase(),
        url: err.config.url,
        statusCode: err.response.status,
        name: name,
        message: err.message,
        data: {
            request: {
                headers: err.config.headers,
                method: err.config.method,
                url: err.config.url,
                data: err.config.data
            },
            response: {
                data: err.response.data,
                status: err.response.status,
                headers: err.response.headers
            }
        },
        additionalInfo: 'from axios interceptor'
    });

    globalLog.addStep(step);

    return Promise.reject(err);
});

export class Payment implements IUseCase<Dto, Result<void>>{
    async execute(data: Dto): Promise<Result<void>> {
        try {

            const isOk = ((Math.random() * 100) > 70);

            if (isOk) {
                await axios.post(`https://postback-4dev.onrender.com/${data.product.id}`, data.user, { validateStatus: (st) => [200].includes(st) });
                globalLog.addStep(Step.info({ name: 'pagamento', message: 'pagamento realizado com sucesso' }));
                return Ok(null);
            }
            await axios.post('https://postback-4dev.onrender.com/inv/not-found', data.user, { validateStatus: (st) => [200].includes(st) });
            globalLog.addStep(Step.error({ name: 'pagamento', message: 'Pagamento não encontrado'}));
            return Ok(null);
        } catch (err) {

            const step = Step.catch(err as Error);
            globalLog.addStep(step);
            return Fail((err as Error).message);
        }
    }
}

export default Payment;
