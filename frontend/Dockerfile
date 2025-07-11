FROM node:20-alpine

WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 코드 복사
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 