import axios, { AxiosError } from "axios";
import { Fail, IUseCase, Ok, Result } from "rich-domain";
import { Step, Steps } from "ts-logs";
import { Dto as Product } from './find-product.use-case';
import { Dto as User } from './login.use-case';

export interface Dto {
    user: User;
    product: Product;
}

export class Payment implements IUseCase<Dto, Result<void, Steps>>{
    async execute(data: Dto): Promise<Result<void, Steps>> {
        try {

            const isOk = ((Math.random() * 100) > 30);

            if(isOk){
                await axios.post(`https://postback-4dev.onrender.com/${data.product.id}`, data, { validateStatus: (st) => [201].includes(st)});
                return Ok(null);
            }
            return await axios.post('https://postback-4dev.onrender.com/inv/not-found', data, { validateStatus: (st) => [201].includes(st)});
        } catch (err: any) {
            const error: AxiosError & Error = err;

            // 0 - Get some uid from data as id
            console.log('Uid: ', error.config?.data?.['id']);        

            // 0 - Get Stack
            console.log('Stack: ', error.stack);

            // Identify if is AxiosError
            console.log('IsAxios: ', error.stack?.includes('AxiosError'));

            // 1- Get Error Message
            console.log('Message: ', error.message);
            
            // 2 - Geta try get data from response or request
            // Remove keys from body option: ["card", "password"]
            // Encrypt data? true | false
            console.log('Request Data: ', error.config?.data);
            console.log(typeof error.response?.data); // html é do tipo string | data tipo object
            console.log('Response Data: ', error.response?.data);

            // 3 - Get status code from response
            const sts = error.response?.status;
            const status = typeof sts === 'number' ? sts: 500;
            console.log('Status: ', status);

            // 4 - Get method
            console.log('Method: ', (error.config?.method as string ?? 'NONE').toUpperCase());

            // 5 - Get URL 
            console.log('Url: ', error.config?.url);

            // Create a step from error in catch block
            // data: optional
            // remove: optional
            // name: required
            // error: required
            // Step.catch({ error, name: 'Payment', data, remove: ['card'] });

            const step = Step.error({ 
                message: (error as Error).message, 
                name: 'Payment', 
                stack: (error as Error).stack, 
                method: 'POST',
                statusCode: 500,
                data: JSON.stringify(data)
            })
            return Fail(step);
        }
    }
}

export default Payment;
