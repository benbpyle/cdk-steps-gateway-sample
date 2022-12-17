import {Construct} from 'constructs';
import * as cdk from 'aws-cdk-lib';
import {OneLambda} from "./one-lambda";
import {StackProps} from "aws-cdk-lib";
import {StateMachineStack} from "./state-machine-stack";
import {ApiGatewayConstruct} from "./api-gateway-construct";

export class MainStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props);

        const mainFunc = new OneLambda(this, 'PccPatientPrep')
        const states = new StateMachineStack(this, 'StateMachine', mainFunc.function);
        const gateway = new ApiGatewayConstruct(
            this,
            'ApiGateway',
            states.stateMachine)
    }
}
