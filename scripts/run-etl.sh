#!/bin/bash

layer=$1

test -f build-dependencies.sh && sh build-dependencies.sh utils

spark-submit --py-files utils.zip "${layer}_etl.py"
