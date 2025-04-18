#!/bin/bash

# Takes the dependencies directory as its only argument,
# creates .zip file with the same name
directory=$1

echo "Building dependencies from following directory: $directory"

test -d "$directory" || (echo "The Spark dependencies directory does not exist" && exit)

test -f ./"$directory".zip && echo "Deleting previous build..." && rm ./"$directory".zip

zip -r ./"$directory".zip "$directory" && echo "Dependency built successfully"
