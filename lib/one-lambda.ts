import {Construct} from "constructs";
import {GoFunction} from "@aws-cdk/aws-lambda-go-alpha";
import {Duration} from "aws-cdk-lib";
import * as path from "path";

export class OneLambda extends Construct {
    private readonly _func: GoFunction;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this._func = new GoFunction(this, `OneLambda`, {
            entry: path.join(__dirname, `../src`),
            functionName: `sample-func`,
            timeout: Duration.seconds(30)
        });
    }

    get function(): GoFunction {
        return this._func
    }
}
