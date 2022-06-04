#!/bin/bash

source /opt/venv/slither/bin/activate
ANALYSIS_PATH=./lib/echidna
mkdir -p $ANALYSIS_PATH

echidna-test \
  tests/DGame.fuzz.test.sol \
  --contract DGameFuzz \
  --config echidna.config.yml \
  --test-mode property \
  > "$ANALYSIS_PATH/analysis.json"
