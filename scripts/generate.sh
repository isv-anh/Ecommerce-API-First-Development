#!/bin/bash

TSP_DIR="openapi-typespec/src"

OUTPUT_DIR="docs/openapi"

for dir in "$TSP_DIR"/*; do
  name=$(basename "$dir")
  if [ "$name" != "common" ]; then
    tsp compile "$dir/main.tsp" \
      --emit @typespec/openapi3 \
      --output-dir $OUTPUT_DIR \
      --option "@typespec/openapi3.output-file=$name/$name.json"
  fi
done