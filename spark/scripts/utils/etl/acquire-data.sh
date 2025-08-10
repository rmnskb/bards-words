#!/bin/bash

mkdir_cd() {
  dir=$1

  if ! test -d ../../../"$dir"/; then
    mkdir ../../../"$dir"/
  fi

  cd ../../../"$dir"/ || exit
}

extract_data() {
  # Mimic a browser-like User-Agent
  agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
  address="https://flgr.sh/txtfssAlltxt"

  curl -L -A "$agent" -o ./fssAlltxt.zip "$address"
  unzip fssAlltxt.zip

  # Clean up the mess after yourself
  rm -rf ./__MACOSX fssAlltxt.zip

  for filename in *.txt; do
    # Delete the lines 2 through 7 containing metadata about the text
    # See https://askubuntu.com/questions/992213
    sed -i -e '2d;3d;4d;5d;6d;7d' "$filename"

    # See https://stackoverflow.com/questions/6840332
    # Rename the files with RegEx pattern _TXT_FolgerShakespeare\.txt --> \.txt
    mv "$filename" "${filename//_TXT_FolgerShakespeare\.txt/\.txt}"
  done
}

upload_to_aws() {
  dir=$1
  bucket=$2

  aws s3 cp "$dir" s3://"$bucket" --recursive
}

target=$1
bucket=$2

if [ "$target" == "local" ]; then
  dir="data"
  echo "Creating directory $dir..."
  mkdir_cd "$dir"
  echo "Extracting the data..."
  extract_data
else
  dir="temp"
  echo "Creating directory $dir..."
  mkdir_cd "$dir"
  echo "Extracting the data..."
  extract_data
  cd .. || exit
  echo "Uploading the data to S3 bucket: $bucket..."
  upload_to_aws temp "$bucket"
  echo "Deleting the directory $dir..."
  rm "$dir"
fi
