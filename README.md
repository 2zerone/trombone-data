# TROMBONE 테스트 데이터 자동 생성 도구

## 📋 개요

TROMBONE 시스템에서 테스트에 필요한 사전 데이터를 자동으로 생성하는 도구입니다.

---

## 🎯 목적

TROMBONE 시스템에서 테스트에 필요한 사전 데이터를 자동으로 생성하여 테스트 환경 구축 시간을 단축하고 일관된 테스트 데이터를 제공하기 위한 자동화 도구입니다.

---

## 🚀 주요 기능

1. 업무 코드 생성
2. 업무코드의 저장소
3. 사용자 생성 및 티켓, 사용자 역할 지정
4. SonarQube 등록
5. JUnit 등록
6. STG/PRD 파이프라인 등록
7. 워크플로우 컴포넌트 생성

---

## 📝 참고 사항

- 워크플로우 구성은 구현 전 단계입니다.
- SonarQube나 JUnit에 필요한 테스트 파일들은 GitLab 저장소에 직접 push가 필요합니다.

---

## 📋 버전 정보

| 항목 | 내용 |
|------|------|
| **프로젝트 버전** | 1.0.0 |
| **Node.js** | 16.0.0+ |
| **Playwright** | 1.53.1 |
| **npm** | 8.0.0+ |

---

## 🔧 설치 및 실행

### 시스템 요구사항
- **Node.js**: 16.0.0 이상
- **npm**: 8.0.0 이상
- **운영체제**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **VPN**: 운영존3 접근 권한

### 1. 설치
```bash
# 저장소 클론
git clone [repository-url]
cd uitest

# 의존성 설치
npm install

# Playwright 브라우저 설치
npm run test:install
```

### 2. 테스트 명령어
```bash
# 기본 실행 (헤드리스 모드)
npm test

# 브라우저에서 실행 (권장)
npm run test:headed

# 디버그 모드
npm run test:debug

# Playwright UI 모드
npm run test:ui

# 결과 보고서 확인
npm run test:report

# 특정 테스트 파일 실행
npx playwright test tests/trombone_test.spec.js
```

---

## 📊 로그 내용

### 콘솔 출력 예시
```
TEST001 업무코드를 등록했습니다.
TEST 업무코드(TEST001)를 툴체인에 추가했습니다.
TEST-REPO 저장소를 등록했습니다.
사용자 user001이 정상적으로 등록되었습니다.
SonarQube가 정상적으로 등록되었습니다.
JUnit이 정상적으로 등록되었습니다.
STG 파이프라인이 정상적으로 등록되었습니다.
PRD 파이프라인이 정상적으로 등록되었습니다.
TEST001-결재컴포넌트(결재자) 워크플로우 컴포넌트가 정상적으로 등록되었습니다.
...
```

---

## ⏱️ 전체 실행 시간

- **trombone_test.spec.js 전체 실행**: 약 1분10초-1분20초
- **trombone_test_2seconds.spec.js 전체 실행**: 약 8-10분

---

## 🏗️ 프로젝트 구조

```
uitest/
├── tests/
│   ├── trombone.spec.js  # 메인 자동화 스크립트
│   ├── pipeline-stg.txt             # STG 파이프라인 설정
│   └── pipeline-prd.txt             # PRD 파이프라인 설정
├── playwright.config.js             # Playwright 설정
└── package.json                     # 프로젝트 설정
```

---

## 🔮 추후 고도화 사항

### 계획
- [ ] 워크플로우 구성 단계 자동화
- [ ] CI/CD 티켓 생성, 진행, 종료 단계 자동화
- [ ] 테스트 시나리오 자동화

---

## 📅 최종 업데이트 날짜

**최종 업데이트**: 2025년 7월 6일