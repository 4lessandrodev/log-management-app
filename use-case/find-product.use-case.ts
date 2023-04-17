import { IUseCase, Ok, Result } from "rich-domain";
import { Step } from "ts-logs";
import globalLog from "../global-log";

export interface Dto {
    id: string;
}

export class FindProduct implements IUseCase<Dto, Result<void>>{
    async execute(data: Dto): Promise<Result<void>> {
        const isOk = ((Math.random() * 100) > 20);

        globalLog.addStep(Step.info({ name: 'buscar produto', message: 'Buscando produto...'}));
        if (isOk) return Ok(null);

        const step = Step.error({ 
            message: 'Could not get product', 
            name: 'Get Product', 
            stack: 'Timeout', 
            method: 'POST',
            statusCode: 502,
            data: data
        })
        
        globalLog.addStep(step);
        return Ok();
    }
}

export default FindProduct;
