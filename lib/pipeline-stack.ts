import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CicdStack } from './cicd-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a custom role for the pipeline
    const pipelineRole = new iam.Role(this, 'PipelineRole', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('codepipeline.amazonaws.com'),
        new iam.ServicePrincipal('codebuild.amazonaws.com')
      ),
      description: 'Role for CodePipeline and CodeBuild',
    });

    // Add necessary permissions
    pipelineRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'codestar-connections:UseConnection',
        'codebuild:*',
        'cloudformation:*',
        'iam:PassRole',
        's3:*',
        'logs:*'
      ],
      resources: ['*'],
      effect: iam.Effect.ALLOW,
    }));

    // Create the pipeline
    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'mart5124-cicd-pipeline',
      role: pipelineRole,
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          'martinjohny167/mart5124-cicd-project',
          'main',
          {
            connectionArn: 'arn:aws:codeconnections:us-east-1:183494329089:connection/f702806d-b71c-46f0-b194-efb96cd23acd',
          }
        ),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'cdk.out',
      }),
      selfMutation: true,
      crossAccountKeys: true,
    });

    // Add application stage
    pipeline.addStage(new ApplicationStage(this, 'Production', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
      }
    }));
  }
}

class ApplicationStage extends cdk.Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    new CicdStack(this, 'mart5124-cicd-stack', props);
  }
} 