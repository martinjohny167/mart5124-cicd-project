import * as cdk from 'aws-cdk-lib';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import { CicdStack } from './cicd-stack';

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Pipeline code will go here
    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      pipelineName: 'mart5124-cicd-pipeline',
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection(
          'martinjohny167/mart5124-cicd-project',
          'main',
          {
            connectionArn: 'arn:aws:codestar-connections:us-east-1:183494329089:connection/8acf5a29-62ab-4569-b206-bfc54c3a3ee2',
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