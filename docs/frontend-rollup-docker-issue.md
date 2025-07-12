# Vite/rollup 네이티브 모듈 Docker 오류 이슈 리포트

## 문제 요약

- Docker 컨테이너 환경에서 React + Vite(rollup 기반) 프론트엔드 기동 시,
- `Error: Cannot find module @rollup/rollup-linux-x64-musl` 오류로 인해 컨테이너가 정상적으로 기동되지 않음
- npm, rollup, Vite, OS/아키텍처(Windows↔Linux, ARM↔x64) 호환성 문제와 관련된 npm의 known bug

---

## 발생 원인

- npm은 package.json의 의존성만 설치하며, 플랫폼/아키텍처별 optionalDependencies는 환경에 따라 누락될 수 있음
- rollup 4.x 이상, vite 5.x 이상에서 네이티브 바이너리(@rollup/rollup-linux-x64-musl 등)가 optionalDependencies로 관리됨
- Windows/ARM 등에서 생성된 lockfile이 Linux/x64 컨테이너에서 호환되지 않아 네이티브 모듈이 누락됨
- Docker 볼륨 마운트, npm install/ci 방식, 캐시 등 다양한 요인이 복합적으로 작용

---

## 시도한 해결 방법 및 실패 원인

1. **lockfile(package-lock.json) 및 node_modules 삭제 후 npm install**
   - **근거:** node_modules가 OS/아키텍처별로 다르게 설치될 수 있고, lockfile이 꼬이면 네이티브 모듈이 누락될 수 있다고 판단. 완전히 삭제 후 새로 설치하면 환경에 맞는 모듈이 재설치될 것이라 기대함.
   - **실패:** 컨테이너 내부에서 여전히 네이티브 모듈이 누락됨
2. **Dockerfile에서 RUN npm ci → RUN npm install로 변경**
   - **근거:** npm ci는 lockfile을 엄격히 따르기 때문에, OS/아키텍처가 다르면 네이티브 모듈이 설치되지 않을 수 있음. npm install은 환경에 맞는 바이너리를 새로 설치하므로 문제를 해결할 수 있다고 판단.
   - **실패:** npm install도 optionalDependencies를 항상 설치하지 않음
3. **optionalDependencies에 @rollup/rollup-linux-x64-musl 명시적 추가**
   - **근거:** optionalDependencies에 명시적으로 추가하면 npm이 해당 모듈을 강제로 설치할 것이라 기대함.
   - **실패:** npm install이 여전히 해당 모듈을 설치하지 않음
4. **named volume(node_modules:/app/node_modules) 방식 적용**
   - **근거:** Docker 볼륨 마운트로 인해 node_modules가 호스트와 컨테이너 간에 꼬일 수 있다는 커뮤니티/StackOverflow 사례를 참고. named volume을 사용하면 컨테이너 내부에서만 node_modules가 관리되어 아키텍처 불일치 문제를 피할 수 있다고 판단.
   - **실패:** 컨테이너 내부에서 네이티브 모듈이 여전히 누락됨
5. **lockfile 없이 npm install, rebuild, npm rebuild rollup 등 강제 재설치**
   - **근거:** lockfile이 없으면 npm이 환경에 맞는 모든 의존성을 새로 설치할 것이라 기대. npm rebuild로 네이티브 모듈을 강제로 재빌드하면 문제를 해결할 수 있다고 판단.
   - **실패:** npm의 구조적 한계로 네이티브 모듈이 설치되지 않음
6. **rollup/vite 버전 다운그레이드, yarn 전환 등은 미적용(추가 대안)**
   - **근거:** 커뮤니티에서 rollup 3.x, vite 4.x, yarn 사용 시 해당 문제가 해결된 사례가 다수 보고됨. 그러나 프로젝트 정책상 우선순위에서 제외함.

---

## 최종 해결 방법

- **package.json의 scripts에 postinstall 스크립트 추가**
  ```json
  "postinstall": "npm install rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs"
  ```
- npm install 후 postinstall이 자동 실행되어, rollup 및 플러그인들이 강제로 설치됨
- 컨테이너 환경에서도 네이티브 모듈이 누락되지 않고 정상적으로 설치됨을 확인

---

## 성공 원인 분석

- postinstall 스크립트는 npm install 이후 무조건 실행되므로,
  - npm의 optionalDependencies/lockfile/아키텍처 이슈와 무관하게 필요한 모듈을 강제로 설치할 수 있음
- rollup 및 플러그인들이 컨테이너 환경에 맞게 재설치되어, 네이티브 모듈 오류가 완전히 해결됨
- 개발 환경의 일관성 및 재현성을 postinstall로 보장할 수 있음

---

## 결론 및 교훈

- npm의 optionalDependencies 및 lockfile 기반 의존성 관리의 한계를 postinstall 스크립트로 효과적으로 우회할 수 있음
- Docker, Vite, rollup, 네이티브 모듈 환경에서 유사한 오류가 발생할 경우 postinstall 활용을 적극 고려할 것
- 플랫폼/아키텍처별 네이티브 모듈 문제는 npm/yarn의 구조적 한계임을 인지하고, CI/CD 환경에서 항상 재현성 검증 필요 