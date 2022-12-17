import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import * as sf from "aws-cdk-lib/aws-stepfunctions";
import * as stepfunctions from "aws-cdk-lib/aws-stepfunctions";
import {LogLevel} from "aws-cdk-lib/aws-stepfunctions";
import * as logs from 'aws-cdk-lib/aws-logs';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class StateMachineStack extends Construct {
    private readonly _stateMachine: sf.StateMachine;

    get stateMachine(): sf.StateMachine {
        return this._stateMachine;
    }

    constructor(scope: Construct, id: string, oneFunc: IFunction) {
        super(scope, id);

        const successState = new stepfunctions.Pass(this, 'SuccessState');
        let oneFuncInvoke = new tasks.LambdaInvoke(this, 'OneFuncInvoke', {
            lambdaFunction: oneFunc,
            comment: 'For the demo',
            outputPath: '$.Payload'
        })

        oneFuncInvoke.next(successState);
        const logGroup = new logs.LogGroup(this, 'sample-state-machine', {
            logGroupName: '/aws/vendedlogs/states/sample'
        });

        this._stateMachine = new stepfunctions.StateMachine(this, 'MyStateMachine', {
            definition: oneFuncInvoke,
            stateMachineType: stepfunctions.StateMachineType.EXPRESS,
            logs: {
                level: LogLevel.ALL,
                destination: logGroup,
                includeExecutionData: true
            }
        });

    }
}