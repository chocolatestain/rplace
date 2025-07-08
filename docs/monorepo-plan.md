# 모노레포 아키텍처 및 개발 환경 계획

## 1. 목적
이 문서는 r/place 스타일 실시간 픽셀 협업 캔버스 프로젝트의 최상위 디렉터리 구조와 공통 개발 환경 요구 사항을 정의합니다. 모든 기여자가 코드베이스를 탐색하고 로컬 개발 환경을 설정할 때 참조하는 단일 출처(Single Source of Truth)가 됩니다.

## 2. 최상위 디렉터리 레이아웃
```
/ (repo root)
├── frontend/           # React 18 + TS 5 SPA
├── backend/            # Spring Boot 3.x 마이크로서비스
├── database/           # Flyway 마이그레이션 및 시드 데이터
├── infrastructure/     # Docker, Terraform, GitHub Actions 워크플로
├── docs/               # 프로젝트 문서 (현재 폴더)
└── scripts/            # 보조 CLI 및 DevOps 스크립트
```

### 설계 근거
* **단일 리포지토리 플로우** – 프론트·백 동시 변경(예: DTO 수정) 시 편의성 향상
* **명확한 도메인 경계** – 각 최상위 폴더는 AWS 배포 단위와 1:1 매핑
* **온보딩 용이성** – 신규 개발자가 하나의 저장소만 클론하면 됨

## 3. 기술 스택 결정
| 레이어            | 선택 기술                              | 근거 |
|-------------------|----------------------------------------|------|
| 프론트엔드        | React 18, Vite 5, Redux Toolkit        | 빠른 HMR, 현대적 SPA 표준 |
| 백엔드            | Spring Boot 3, Java 17                 | WebFlux, LTS 런타임 |
| 영속성            | MySQL 8 (RDS) + Flyway                 | ACID, 버전 관리된 스키마 |
| 캐시·실시간       | Redis 7(Cluster) + Pub/Sub             | 100 ms 이하 픽셀 브로드캐스트 |
| 인프라·배포       | Docker, AWS ECS Fargate                | 컨테이너화, 관리형 오토스케일링 |
| CI/CD            | GitHub Actions                         | PR 단위 테스트, 블루·그린 배포 |

## 4. 공통 개발 요구 사항
* **Node.js ≥ 20** (프론트엔드 빌드)
* **Java 17 JDK** (백엔드 빌드)
* **Docker ≥ 24** 및 **Docker Compose v2**
* **Git LFS** (선택; 향후 타임랩스 에셋 저장)
* `.env.example`을 복사한 로컬 `.env` 파일에 비밀값 입력

## 5. 빌드 & 실행(요약)
```bash
# 전체 스택 로컬 실행
$ docker compose up --build

# 프론트엔드(HMR)
$ cd frontend && npm install && npm run dev

# 백엔드(라이브 리로드)
$ cd backend && ./gradlew bootRun
```
서비스별 상세 스크립트는 추후 커밋에서 추가 예정입니다.

## 6. 툴링 & 컨벤션
1. **ESLint + Prettier** – TS & Java 모두에 일관된 포맷 강제
2. **커밋 메시지** – 콘벤셔널 커밋(`feat:`, `fix:`, `docs:` 등) 한국어 사용
3. **브랜칭 모델** – trunk 기반, 짧은 lived feature 브랜치
4. **Git Hooks** – Husky로 pre-commit 린트·테스트 실행

## 7. 향후 과제
* 루트 `package.json`에 lint-staged, commitlint 등 공통 툴 추가
* GitHub Actions 매트릭스 빌드(프론트·백 테스트, Docker 이미지 빌드)
* Docker Compose 엔트리포인트에서 DB 마이그레이션 자동화

---
*최종 수정: 2025-07-08* 