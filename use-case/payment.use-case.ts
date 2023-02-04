import axios from "axios";
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

            const isOk = ((Math.random() * 100) > 70);

            if(isOk){
                await axios.post(`https://postback-4dev.onrender.com/${data.product.id}`, data.user, { validateStatus: (st) => [201].includes(st)});
                return Ok(null);
            }
            return await axios.post('https://postback-4dev.onrender.com/inv/not-found', data.user, { validateStatus: (st) => [201].includes(st)});
        } catch (err) {
            
            const step = Step.catch(err as Error);
            return Fail(step);
        }
    }
}

export default Payment;
