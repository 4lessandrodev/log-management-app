import { Fail, IUseCase, Ok, Result } from "rich-domain";
import { Step, Steps } from "ts-logs";

export interface Dto {
    email: string;
    password: string
}

export class Login implements IUseCase<Dto, Result<void, Steps>>{
    async execute(data: Dto): Promise<Result<void, Steps>> {
        const isOk = ((Math.random() * 100) > 30);

        if (isOk) return Ok(null);

        const step = Step.error({ 
            message: 'Could not login to user', 
            name: 'Login', 
            stack: 'Timeout', 
            method: 'POST',
            statusCode: 502,
            data: JSON.stringify(data)
        })
        return Fail(step);
    }
}

export default Login;
