import { Fail, IUseCase, Ok, Result } from "rich-domain";
import { Step, Steps } from "ts-logs";

export interface Dto {
    id: string;
}

export class FindProduct implements IUseCase<Dto, Result<void, Steps>>{
    async execute(data: Dto): Promise<Result<void, Steps>> {
        const isOk = ((Math.random() * 100) > 30);

        if (isOk) return Ok(null);

        const step = Step.error({ 
            message: 'Could not get product', 
            name: 'Get Product', 
            stack: 'Timeout', 
            method: 'POST',
            statusCode: 502,
            data: JSON.stringify(data)
        })
        return Fail(step);
    }
}

export default FindProduct;
