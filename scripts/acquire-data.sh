#!/bin/bash

if ! test -d ./data/; then
  mkdir data/
fi

cd data/ || exit

# Mimic a browser-like User-Agent
agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
address="https://flgr.sh/txtfssAlltxt"

curl -L -A "$agent" -o ./fssAlltxt.zip "$address"
unzip fssAlltxt.zip

# Clean up the mess after yourself
rm -rf ./__MACOSX fssAlltxt.zip

# Rename the files with RegEx pattern _TXT_FolgerShakespeare\.txt --> \.txt
for filename in *.txt; do
  # See https://stackoverflow.com/questions/6840332
  mv "$filename" "${filename//_TXT_FolgerShakespeare\.txt/\.txt}"
done
