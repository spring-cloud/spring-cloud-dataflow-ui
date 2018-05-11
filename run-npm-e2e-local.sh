#!/bin/bash
set -ev
cd ui
npm install
npm run e2e
cd ..