# Use a multi-stage build to reduce the image size
# Stage 1: Build the application
FROM node:latest as builder

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --no-fund --no-audit --silent --prefer-offline

COPY . .

RUN npm run build

# Stage 2: Setup the production environment
FROM node:alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV NODE_CONFIG_DIR=/usr/src/dist/config

EXPOSE 3000

CMD [ "node", "dist/main"]
