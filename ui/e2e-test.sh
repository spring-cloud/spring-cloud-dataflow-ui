#!/bin/bash

BASE_DIR=.

echo ""
echo "Tip: start using './e2e-test.sh debug' to enter debug mode."
echo "Starting Protractor..."
echo $BASE_DIR
echo "-------------------------------------------------------------------"

node_modules/protractor/bin/protractor $1 test/protractor.conf.js
