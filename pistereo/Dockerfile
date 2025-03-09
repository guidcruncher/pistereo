# Use a multi-stage build to reduce the image size
# Stage 1: Build the application
FROM node:latest as builder

ENV NODE_ENV=production

WORKDIR /usr/app

COPY package*.json ./

RUN npm ci --no-fund --no-audit --silent --prefer-offline

COPY . .

RUN npm run build

# Stage 2: Setup the production environment
FROM node:alpine

WORKDIR /usr/app

COPY --from=builder /usr/app/dist ./dist
COPY --from=builder /usr/app/node_modules ./node_modules

RUN mkdir -p /usr/app/dist/config
COPY ./config/config-sample.yaml /usr/app/dist/config/config-sample.yaml 
ENV NODE_CONFIG_DIR=/usr/app/dist/config
ENV PISTEREO_CLIENT_BASE=/usr/app/dist/client

EXPOSE 3000

CMD [ "nom", "run", "start:prod"]
