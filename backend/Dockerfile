FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD npx ts-node src/createUser.ts && npx ts-node src/generateMeasures.ts && npx ts-node src/index.ts
