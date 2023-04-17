import { IUseCase, Ok, Result } from "rich-domain";
import FindProduct from './find-product.use-case';
import Login from './login.use-case';
import Payment from "./payment.use-case";

export interface Dto {
    email: string;
    password: string;
    id: string;
}

export default class MainUseCase implements IUseCase<Dto, Result<void>>{
    constructor(
        private readonly login: Login,
        private readonly findProduct: FindProduct,
        private readonly payment: Payment
    ){}
    async execute(dto: Dto): Promise<Result<void>> {
        const { email = 'valid@email.com', password = '12345', id = '1' } = dto;

        await this.login.execute({ email, password });

        await this.findProduct.execute({ id });

        await this.payment.execute({ user: { email, password }, product:{ id}});

        return Ok(null);
    }
}
