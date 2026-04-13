FROM maven:3.8.5-openjdk-17 AS build

ARG UID
ARG GID

WORKDIR /app

COPY packages/openapi-generator . 

RUN mvn clean package -DskipTests

FROM openapitools/openapi-generator-cli:v7.21.0

ARG UID
ARG GID

WORKDIR /app

RUN mkdir -p /app/output && \
    chown -R ${UID}:${GID} /app

COPY --from=build --chown=${UID}:${GID} /app/target/openapi-generator-1.0.0.jar ./app.jar

USER ${UID}:${GID}

ENV OPENAPI_GENERATOR_CLASSPATH=/app/app.jar

CMD sh -c 'for file in ./docs/openapi/*.json; do \
    [ -f "$file" ] || continue; \
    name=$(basename "$file" .json); \
    java -cp "/app/app.jar:/opt/openapi-generator/modules/openapi-generator-cli/target/openapi-generator-cli.jar:/opt/openapi-generator/modules/openapi-generator-cli/target/lib/*" \
    -DgeneratedControllerPath=/app/output/generated-controller \
    -DcustomPath=/app/output/custom \
    org.openapitools.codegen.OpenAPIGenerator generate \
    -g custom-generator \
    --skip-validate-spec \
    -i "$file" \
    -o "/app/output/tmp/$name" && \
    rm -rf "/app/output/tmp/$name"; \
    done'