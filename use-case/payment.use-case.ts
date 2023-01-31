import { Fail, IUseCase, Result } from "rich-domain";
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
            throw new Error('Internal Server Error On Process Payment');
        } catch (error) {
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
