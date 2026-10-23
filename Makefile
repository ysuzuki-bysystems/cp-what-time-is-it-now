.PHONY: nop push-and-run

nop:

cdk-output.json: cdk-app.ts
	bunx cdk deploy --all --yes -O $@

src.zip: $(wildcard src-content/*)
	mkdir -p $(<D)
	(cd $(<D) && zip -r $(CURDIR)/$@ .)

push-and-run: src.zip cdk-output.json
	aws s3 cp src.zip 's3://$(shell jq -r .CpWhatTimeIsItNow.SourceBucketName cdk-output.json)/src.zip'
	aws codepipeline start-pipeline-execution --name '$(shell jq -r .CpWhatTimeIsItNow.PipelineName cdk-output.json)'
