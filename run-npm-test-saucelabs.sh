#!/bin/bash
set -ev
cd ui
npm install
npm run test-saucelabs-local
cd ..