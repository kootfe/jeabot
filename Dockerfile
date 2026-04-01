FROM oven/bun:1-alpine AS base
WORKDIR /app
RUN apk add --no-cache ca-certificates && update-ca-certificates
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
CMD ["bun", "run", "index.ts"]
