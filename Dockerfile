#build stage
FROM node:18-alpine AS build

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#prod stage
FROM node:18-alpine AS prod

WORKDIR /usr/src/app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NODE_ENV=${NODE_ENV}

COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./

RUN npm install --only=production

RUN rm package*.json

EXPOSE 3001

CMD ["node", "dist/src/main.js"]
