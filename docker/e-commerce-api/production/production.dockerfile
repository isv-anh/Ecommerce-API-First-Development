FROM jelastic/maven:3.9.5-openjdk-21 AS build

WORKDIR /app

COPY hrm-api/pom.xml .

COPY hrm-api/src ./src

RUN mvn clean install -DskipTests

FROM openjdk:21-slim

WORKDIR /app

RUN addgroup --system --gid 1001 java
RUN adduser --system --uid 1001 spring

COPY --from=build --chown=spring:java /app/target/hrm-api-0.0.1-SNAPSHOT.jar ./app.jar

USER spring

EXPOSE 8080

CMD [ "java", "-jar", "app.jar" ]