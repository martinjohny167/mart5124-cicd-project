import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CicdStack } from './cicd-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create role for CodeStar connection
    const connectionRole = new iam.Role(this, 'CodeStarConnectionRole', {
      assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),
      description: 'Role for CodeStar connection to GitHub',
    });

    // Add permissions for CodeStar connection
    connectionRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'codestar-connections:UseConnection'
      ],
      resources: ['arn:aws:codeconnections:us-east-1:183494329089:connection/f702806d-b71c-46f0-b194-efb96cd23acd'],
      effect: iam.Effect.ALLOW,
    }));

    // Pipeline code will go here
    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'mart5124-cicd-pipeline',
      role: connectionRole, // Use the role with CodeStar permissions
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
      }),
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