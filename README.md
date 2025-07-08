# r/place 모노레포

실시간 픽셀 협업 캔버스 프로젝트의 단일 저장소입니다. 프론트엔드, 백엔드, 데이터베이스, 인프라 구성 파일이 함께 관리됩니다.

- 상세 아키텍처 및 개발 환경 계획은 `docs/monorepo-plan.md` 참고
- 개발 환경 설정 방법은 각 디렉터리별 README에서 안내 예정

## 문서
* [모노레포 설계 문서](docs/monorepo-plan.md)
* [공통 개발 가이드](docs/development-guide.md)

## 디렉터리 개요
| 폴더 | 설명 |
|-------|------|
| frontend | React 18 + Vite SPA 소스 코드 |
| backend | Spring Boot 3.x 서비스 소스 코드 |
| database | Flyway SQL 마이그레이션 스크립트 |
| infrastructure | Docker, Terraform, GitHub Actions 등 |
| scripts | 개발·배포 관련 유틸리티 스크립트 |

## 빠른 시작
```bash
# 전체 스택 (추후 Docker Compose 파일 제공 예정)
$ docker compose up --build
``` 