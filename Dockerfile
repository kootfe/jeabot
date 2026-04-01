FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock /app/

RUN npm install -g bun
RUN bun install

COPY . /app/

ENV NODE_ENV=production

CMD ["bun", "run", "start"]
