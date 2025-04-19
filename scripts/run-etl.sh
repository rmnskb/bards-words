#!/bin/bash

build_dependencies() {
  # Takes the dependencies directory as its only argument,
  # creates .zip file with the same name
  local directory=$1

  echo "Building dependencies from following directory: $directory"

  test -d "$directory" || (echo "The Spark dependencies directory does not exist" && exit)

  test -f ./"$directory".zip && echo "Deleting previous build..." && rm ./"$directory".zip

  zip -r ./"$directory".zip "$directory" && echo "Dependency built successfully"
}


layer=$1
directory=${2:-"utils"}  # Either take the argument provided by user or put a default one

build_dependencies "$directory"

spark-submit --py-files "${directory}.zip" "${layer}_etl.py"
