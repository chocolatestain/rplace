FROM openjdk:17-jdk-slim

WORKDIR /app

# Gradle wrapper 복사
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts ./

# 의존성 다운로드
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사
COPY src src

# 애플리케이션 빌드 (테스트 제외)
RUN ./gradlew build --no-daemon -x test

EXPOSE 8080

CMD ["./gradlew", "bootRun"] 