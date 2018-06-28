#!/bin/bash
set -ev
cd ui
npm install
pwd
ls -al
ls -al e2e
npm run e2e
cd ..