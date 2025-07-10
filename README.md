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

### 2. 설정 파일 구성
`config/test-settings.json` 파일을 수정하여 프로젝트 정보를 설정합니다:

```json
{
  "login": {
    "userId": "your_user_id",
    "password": "your_password"
  },
  "project": {
    "code": "TEST001",
    "name": "테스트 프로젝트"
  },
  "repository": {
    "name": "test-repository"
  },
  "user": {
    "id": "testuser",
    "name": "테스트 사용자",
    "email": "test@example.com",
    "level": "L4",
    "role": "개발자",
    "systemRole": "개발자"
  }
}
```

### 3. 테스트 명령어

#### 기본 실행
```bash

# 메인 테스트 실행
npm run test:main

# 디버그 모드
npm run test:debug

# 결과 보고서 확인
npm run test:report
```

#### 느린 버전 실행 (데모용)
```bash
# 느린 버전 실행 (2초 딜레이)
npm run test:slow

```



---

## 📁 프로젝트 구조

```
uitest/
├── config/
│   └── test-settings.json          # 테스트 설정 파일
├── lib/
│   ├── classes/                    # 기본 매니저 클래스들
│   │   ├── TromboneUtils.js        # 공통 유틸리티
│   │   ├── LoginManager.js         # 로그인 관리
│   │   ├── TaskCodeManager.js      # 업무 코드 관리
│   │   ├── ToolchainManager.js     # 툴체인 관리
│   │   ├── RepositoryManager.js    # 저장소 관리
│   │   ├── UserManager.js          # 사용자 관리
│   │   ├── SonarQubeManager.js     # SonarQube 관리
│   │   ├── JUnitManager.js         # JUnit 관리
│   │   ├── PipelineManager.js      # 파이프라인 관리
│   │   └── WorkflowComponentManager.js # 워크플로우 관리
│   └── classes-slow/               # 느린 버전 매니저 클래스들 (2초 딜레이)
├── tests/
│   ├── steps/                      # 기본 테스트 단계들
│   │   ├── step1-taskcode.spec.js  # 1단계: 업무 코드
│   │   ├── step2-toolchain.spec.js # 2단계: 툴체인
│   │   ├── step3-repository.spec.js # 3단계: 저장소
│   │   ├── step4-user.spec.js      # 4단계: 사용자
│   │   ├── step5-sonarqube.spec.js # 5단계: SonarQube
│   │   ├── step6-junit.spec.js     # 6단계: JUnit
│   │   ├── step7-pipeline.spec.js  # 7단계: 파이프라인
│   │   └── step8-workflow.spec.js  # 8단계: 워크플로우
│   ├── steps-slow/                 # 느린 버전 테스트 단계들
│   ├── trombone-main.spec.js       # 메인 테스트 파일
│   ├── trombone-main-slow.spec.js  # 느린 버전 메인 테스트
│   ├── pipeline-stg.txt            # STG 파이프라인 설정
│   └── pipeline-prd.txt            # PRD 파이프라인 설정
├── playwright.config.js            # Playwright 설정
├── package.json                    # 프로젝트 설정
└── README.md                       # 프로젝트 문서
```

---



## 📁 파일 설명

### 테스트 파일
- **`trombone-main.spec.js`** (추천): 메인 테스트 파일로, 8단계 순차 실행 구조입니다. 로그인 후 각 단계별 테스트를 순차적으로 실행합니다.
- **`trombone-main-slow.spec.js`**: 느린 버전 메인 테스트 파일로, 각 단계마다 2초 딜레이가 추가되어 테스트 과정을 자세히 관찰할 수 있습니다.

### 단계별 테스트 파일 (tests/steps/)
각 단계가 독립적인 파일로 분리되어 관리됩니다:

- **`step1-taskcode.spec.js`**: 1단계 - 업무 코드 등록
- **`step2-toolchain.spec.js`**: 2단계 - 툴체인에 업무코드 등록
- **`step3-repository.spec.js`**: 3단계 - 저장소 등록
- **`step4-user.spec.js`**: 4단계 - 사용자 등록
- **`step5-sonarqube.spec.js`**: 5단계 - SonarQube 등록
- **`step6-junit.spec.js`**: 6단계 - JUnit 등록
- **`step7-pipeline.spec.js`**: 7단계 - 파이프라인 등록 (STG/PRD)
- **`step8-workflow.spec.js`**: 8단계 - 워크플로우 컴포넌트 등록 및 검증

### 느린 버전 테스트 파일 (tests/steps-slow/)
기본 단계 파일과 동일하지만 느린 버전으로, 각 단계마다 2초 딜레이가 추가되어 있습니다.

### 매니저 클래스 파일 (lib/classes/)
모든 클래스가 별도 파일로 분리되어 관리됩니다:

- **`TromboneUtils.js`**: 공통 유틸리티 메서드들 (대기, 클릭, 입력, 저장/취소 등)
- **`LoginManager.js`**: 로그인 및 초기 설정 관리
- **`TaskCodeManager.js`**: 업무 코드 생성 및 관리
- **`ToolchainManager.js`**: 툴체인에 업무코드 등록
- **`RepositoryManager.js`**: 저장소 생성 및 관리
- **`UserManager.js`**: 사용자 등록 및 관리
- **`SonarQubeManager.js`**: SonarQube 설정 및 관리
- **`JUnitManager.js`**: JUnit 설정 및 관리
- **`PipelineManager.js`**: 파이프라인 생성 및 관리
- **`WorkflowComponentManager.js`**: 워크플로우 컴포넌트 생성 및 검증

### 느린 버전 매니저 클래스 파일 (lib/classes-slow/)
기본 매니저 클래스와 동일하지만 모든 메서드에 2초 딜레이가 추가되어 있습니다.

### 설정 파일
- **`config/test-settings.json`**: 테스트에 필요한 모든 설정 정보를 포함합니다.
  - 로그인 정보 (아이디, 비밀번호)
  - 프로젝트 정보 (프로젝트 코드, 프로젝트명)
  - 저장소 정보 (저장소명)
  - 사용자 정보 (사용자 ID, 이름, 이메일, 역할 등)

### 파이프라인 설정 파일
- **`tests/pipeline-stg.txt`**: STG 환경 파이프라인 설정
- **`tests/pipeline-prd.txt`**: PRD 환경 파이프라인 설정

### 클래스 분리의 장점
1. **유지보수성**: 각 클래스가 독립적으로 관리되어 수정이 용이
2. **재사용성**: 다른 테스트에서도 클래스를 import하여 사용 가능
3. **가독성**: 코드가 모듈화되어 이해하기 쉬움
4. **테스트 가능성**: 각 클래스를 개별적으로 테스트 가능
5. **느린 버전 지원**: 데모나 교육용으로 느린 버전 제공

---

## 📈 기대 효과

### 시간 절약
- **수동 설정**: 약 15-20분
- **자동화**: 약 1분 20초

### 품질 향상
- 일관된 테스트 데이터 제공
- 인적 오류 방지

---


## 🔄 향후 계획

- [ ] 워크플로우 구성 단계 자동화
- [ ] CI/CD 티켓 생성, 진행, 종료 단계 자동화
- [ ] 테스트 시나리오 자동화

---

## 📅 최종 업데이트 날짜
**최종 업데이트**: 2025년 7월 6일