FROM jelastic/maven:3.9.5-openjdk-21

ARG UID
ARG GID

RUN groupadd -g ${GID} appgroup && \
    useradd -m -u ${UID} -g appgroup pengu

ENV HOME=/home/pengu


WORKDIR /app/e-commerce-api/

EXPOSE 8080

USER pengu

CMD [ "mvn", "spring-boot:run" ]