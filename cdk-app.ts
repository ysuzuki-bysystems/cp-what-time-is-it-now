#!/usr/bin/env bun

import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cp from "aws-cdk-lib/aws-codepipeline";
import * as cpa from "aws-cdk-lib/aws-codepipeline-actions";

const app = new cdk.App();
const stack = new cdk.Stack(app, "CpWhatTimeIsItNow", {
  env: {
    account: "266608227104",
    region: "ap-northeast-1",
  },
});

const sourceBucket = new s3.Bucket(stack, "SourceBucket", {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
  versioned: true,
});

const artifactBucket = new s3.Bucket(stack, "ArtifactBucket", {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true,
});

const pipeline = new cp.Pipeline(stack, "Pipeline", {
  artifactBucket,
});

const artifact = new cp.Artifact();

const source = pipeline.addStage({
  stageName: "Source",
});
source.addAction(new cpa.S3SourceAction({
  actionName: "source",
  bucket: sourceBucket,
  bucketKey: "src.zip",
  output: artifact,
}));

const run = pipeline.addStage({
  stageName: "Run",
});
run.addAction(new cpa.CommandsAction({
  actionName: "run",
  input: artifact,
  commands: [
    "date",
    "stat *",
    "make", // may be fail
  ],
}));

new cdk.CfnOutput(stack, "SourceBucketName", {
  value: sourceBucket.bucketName,
});

new cdk.CfnOutput(stack, "PipelineName", {
  value: pipeline.pipelineName,
});
