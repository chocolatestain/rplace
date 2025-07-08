# 공통 개발 가이드

이 문서는 r/place 모노레포 프로젝트를 로컬에서 설정·개발·배포하기 위한 절차와 규칙을 설명합니다.

---

## 1. 사전 요구 사항
| 도구 | 최소 버전 | 설치 확인 |
|------|-----------|-----------|
| Node.js | 20.x | `node -v` |
| npm | 10.x (Node 20 포함) | `npm -v` |
| Java | 17 | `java -version` |
| Docker | 24.x | `docker -v` |
| Docker Compose | v2 (Docker 내장) | `docker compose version` |
| Git | 2.40+ | `git --version` |

> 선택: Git LFS, VSCode + ESLint/Prettier 확장

---

## 2. 저장소 클론
```bash
$ git clone https://github.com/your-org/rplace.git
$ cd rplace
```

---

## 3. 환경 변수 설정
1. 루트에 `.env.example`이 제공될 예정입니다.
2. 해당 파일을 `.env`로 복사 후 필요한 값을 채워 넣습니다.

---

## 4. 전체 스택 실행
Docker Compose로 MySQL·Redis 등을 포함한 전체 스택을 기동합니다.
```bash
$ docker compose up --build
```

### 4.1 프론트엔드만 실행
```bash
$ cd frontend
$ npm install
$ npm run dev
```

### 4.2 백엔드만 실행
```bash
$ cd backend
$ ./gradlew bootRun
```

> 백엔드 포트는 기본 8080, 프론트엔드 dev 서버는 5173입니다.

---

## 5. 코드 스타일 & 린트
ESLint + Prettier를 사용하여 코드 일관성을 유지합니다.
```bash
# 전체 린트 실행
$ npx eslint "frontend/src/**/*.{ts,tsx}"
```
Prettier는 VSCode 등 IDE의 저장 시 포맷팅 플러그인을 권장합니다.

---

## 6. 커밋 메시지 규칙
> **콘벤셔널 커밋 + 7가지 규칙**

```
타입(스코프): 주제

본문

바닥글
```

### 6.1 타입 목록
| 타입 | 설명 |
|------|------|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| docs | 문서 변경 |
| style | 포맷/스타일 |
| refactor | 리팩터링 |
| test | 테스트 추가/변경 |
| build | 빌드 시스템, 의존성 |
| ci | CI 구성 |
| chore | 기타 자잘한 변경 |
| perf | 성능 개선 |

- 제목은 50자 이내, 마침표 금지, 명령문 현재시제 사용
- 본문 각 줄 72자 이내, **무엇을/왜** 중심 기술

---

## 7. GitHub Actions CI
`main` 브랜치로의 PR/푸시에 대해:
1. 프론트엔드: 설치 → 린트 → 빌드
2. 백엔드: JDK 17 설정 → Gradle 빌드
오류가 발생하면 병합이 차단됩니다.

---

## 8. 테스트 & 품질 보증(향후)
- React Testing Library, Jest
- Spring Boot Test, Testcontainers

---

## 9. 배포(향후)
- GitHub Actions → Docker Build → AWS ECS Fargate Blue/Green

---

*최종 수정: 2025-07-08* 