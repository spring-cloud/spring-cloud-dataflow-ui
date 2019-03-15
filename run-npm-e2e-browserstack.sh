#!/bin/bash
set -ev
cd ui
mkdir .docker
cd .docker
curl -O https://raw.githubusercontent.com/spring-cloud/spring-cloud-dataflow/v$DATAFLOW_VERSION/spring-cloud-dataflow-server/docker-compose.yml
docker-compose up --no-start
cd ..
npm install
npm run e2e-browserstack-local
cd ..
