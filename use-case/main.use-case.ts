import { IUseCase, Ok, Result } from "rich-domain";
import { Steps } from "ts-logs";
import FindProduct from './find-product.use-case';
import Login from './login.use-case';
import Payment from "./payment.use-case";

export interface Dto {
    email: string;
    password: string;
    id: string;
}

export default class MainUseCase implements IUseCase<Dto, Result<void, Steps>>{
    constructor(
        private readonly login: Login,
        private readonly findProduct: FindProduct,
        private readonly payment: Payment
    ){}
    async execute(dto: Dto): Promise<Result<void, Steps>> {
        const { email = 'valid@email.com', password = '12345', id = '1' } = dto;

        const login = await this.login.execute({ email, password });
        if(login.isFail()) return login;

        const product = await this.findProduct.execute({ id });
        if(product.isFail()) return product;

        const payment = await this.payment.execute({ user: { email, password }, product:{ id}});
        if(payment.isFail()) return payment;

        return Ok(null);
    }
}

