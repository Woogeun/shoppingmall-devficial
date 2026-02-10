# 1) 빌드 단계 (플랫폼 고정으로 아키텍처 불일치 방지)
FROM --platform=linux/amd64 node:22-alpine AS builder

# better-sqlite3 네이티브 빌드용 (컨테이너 내에서 소스 컴파일)
RUN apk add --no-cache openssl python3 make g++

WORKDIR /app

# Prisma CLI가 사용할 SQLite 경로 (dev.db 파일은 아직 없어도 됨)
ENV DATABASE_URL="file:./prisma/dev.db"

# 패키지 파일만 먼저 복사해서 의존성 캐시 활용
COPY package.json package-lock.json ./

RUN npm ci

# 소스 코드 전체 복사
COPY . .

# Prisma 클라이언트 생성 및 빌드
RUN npx prisma generate
RUN npm run build

# 2) 런타임 단계 (builder와 동일 플랫폼)
FROM --platform=linux/amd64 node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DATABASE_URL="file:./prisma/dev.db"

# 런타임에 필요한 패키지 (Prisma의 SQLite 사용 시 openssl 필요할 수 있음)
RUN apk add --no-cache openssl

# 런타임에 필요한 파일만 복사
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Prisma 관련 (schema, migrations, seed 등)
COPY --from=builder /app/prisma ./prisma

# node_modules는 빌드 단계 결과 사용
COPY --from=builder /app/node_modules ./node_modules

# 런타임 이미지에서 Prisma Client 재생성 (.prisma/client 경로 문제 방지)
RUN npx prisma generate

EXPOSE 3001

# 컨테이너 시작 시 .env 로드된 상태에서 db push → seed → 앱 실행
CMD ["sh", "-c", "npm start"]