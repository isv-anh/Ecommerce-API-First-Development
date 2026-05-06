FROM node:22-alpine

ARG UID
ARG GID

WORKDIR /app/e-commerce-front/

EXPOSE 3000

USER ${UID}:${GID}

CMD [ "npm", "run", "dev" ]