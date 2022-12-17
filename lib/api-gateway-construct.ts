
import {Construct} from "constructs";
import {StateMachine} from "aws-cdk-lib/aws-stepfunctions";
import {Effect, Policy, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {AwsIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";

export class ApiGatewayConstruct extends Construct {
    private readonly _api: RestApi;

    constructor(scope: Construct, id: string, stateMachine: StateMachine) {
        super(scope, id);

        this._api = new RestApi(this,
            'RestApi', {
                description: 'Sample API',
                restApiName: 'Sample API',
                disableExecuteApiEndpoint: false,
                deployOptions: {
                    stageName: `main`,
                },
            });

        // Api Gateway Direct Integration
        const credentialsRole = new Role(this, "StartExecution", {
            assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
        });

        credentialsRole.attachInlinePolicy(
            new Policy(this, "StartExecutionPolicy", {
                statements: [
                    new PolicyStatement({
                        actions: ["states:StartExecution"],
                        effect: Effect.ALLOW,
                        resources: [stateMachine.stateMachineArn],
                    }),
                ],
            })
        );

        this._api.root.addMethod(
            "POST",
            new AwsIntegration({
                service: "states",
                action: "StartExecution",
                integrationHttpMethod: "POST",
                options: {
                    credentialsRole,
                    integrationResponses: [
                        {
                            statusCode: "200",
                            responseTemplates: {
                                "application/json": `{"status": "webhook submitted"}`,
                            }
                        },
                        {
                            statusCode: "500",
                            responseTemplates: {
                                "application/json": `{"status": "webhook failed"}`,
                            },
                        }
                    ],
                    requestTemplates: {
                        "application/json": `
                        #set($input = $input.json('$'))
                         {
                           "input": "$util.escapeJavaScript($input).replaceAll("\\\\'", "'")",
              "stateMachineArn": "${stateMachine.stateMachineArn}"
            }`,
                    },
                },
            }),
            {
                methodResponses: [{statusCode: "200"}],
            }
        );
    }
}
