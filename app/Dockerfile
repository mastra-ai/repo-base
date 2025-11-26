FROM node:24-alpine

# Used for container health checks
RUN apk add --no-cache curl

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* .npmrc* ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile --prefer-offline

COPY . .

CMD [ "pnpm", "run", "dev" ]
