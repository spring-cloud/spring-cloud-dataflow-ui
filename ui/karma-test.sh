#!/bin/bash

BASE_DIR=.

echo ""
echo "Starting Karma Server (https://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

karma start karma.conf.js $*
