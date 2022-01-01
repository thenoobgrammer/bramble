#! /bin/bash
##remove previous dist if exists
rm -rf dist
##compile Typscript
cd express
tsc
cd ../
##move other required files to dist
cp -r shScripts dist
cp appspec.yml dist
cp express/package.json dist
cp appName.service dist
cd ./dist
## Zip evertyhing within the dist folder, excluding any hidden macOs files (-X)
zip -r -X yourAppName-dist.zip *
##upload to s3. AWS CLI must be installed
aws s3 cp yourAppName-dist.zip s3://bucketname/