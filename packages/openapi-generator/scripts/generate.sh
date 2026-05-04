#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GENERATOR_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
ROOT_DIR="$(cd "$GENERATOR_DIR/../.." && pwd)"

GENERATOR_JAR="$GENERATOR_DIR/target/openapi-generator-1.0.0.jar"
CLI_JAR="$GENERATOR_DIR/lib/openapi-generator-cli.jar"
OUTPUT_DIR="$(realpath -m "${1:-$ROOT_DIR/output}")"
CUSTOM_PATH="${2:-}"

echo "ROOT_DIR:       $ROOT_DIR"
echo "GENERATOR_DIR:  $GENERATOR_DIR"
echo "GENERATOR_JAR:  $GENERATOR_JAR"
echo "CLI_JAR:        $CLI_JAR"
echo "OUTPUT_DIR:     $OUTPUT_DIR"
echo "CUSTOM_PATH:    ${CUSTOM_PATH:-<not set>}"

# Download openapi-generator-cli if not exists
if [ ! -f "$CLI_JAR" ]; then
  echo "Downloading openapi-generator-cli..."
  mkdir -p "$GENERATOR_DIR/lib"
  curl -sL https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/7.21.0/openapi-generator-cli-7.21.0.jar \
    -o "$CLI_JAR"
fi

# Build jar if not exists
if [ ! -f "$GENERATOR_JAR" ]; then
  echo "Building generator jar..."
  cd "$GENERATOR_DIR"
  mvn clean package -DskipTests
fi

mkdir -p "$OUTPUT_DIR"

for file in "$ROOT_DIR"/docs/openapi/*.json; do
  [ -f "$file" ] || continue
  name=$(basename "$file" .json)
  echo "Generating: $name"

  # Build java args
  JAVA_ARGS="-cp $GENERATOR_JAR:$CLI_JAR"
  JAVA_ARGS="$JAVA_ARGS -DgeneratedControllerPath=$OUTPUT_DIR/generated-controller"
  if [ -n "$CUSTOM_PATH" ]; then
    JAVA_ARGS="$JAVA_ARGS -DcustomPath=$(realpath -m "$CUSTOM_PATH")"
  fi

  java $JAVA_ARGS \
    org.openapitools.codegen.OpenAPIGenerator generate \
    -g custom-generator \
    --skip-validate-spec \
    -i "$file" \
    -o "$OUTPUT_DIR/tmp/$name"

  rm -rf "$OUTPUT_DIR/tmp/$name"
done

echo "Done!"