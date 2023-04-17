import { IUseCase, Ok, Result } from "rich-domain";
import { Step } from "ts-logs";
import globalLog from "../global-log";
export interface Dto {
    email: string;
    password: string
}

export class Login implements IUseCase<Dto, Result<void>>{
    async execute(data: Dto): Promise<Result<void>> {
        const isOk = ((Math.random() * 100) > 20);

        globalLog.addStep(Step.create({ name: 'Login', message: 'Realizando login' }));
        if (isOk) return Ok(null);

        const step = Step.error({ 
            message: 'Could not login to user', 
            name: 'Login', 
            stack: 'Timeout', 
            method: 'POST',
            statusCode: 502,
            data: data
        })
        
        globalLog.addStep(step);
        return Ok();
    }
}

export default Login;
