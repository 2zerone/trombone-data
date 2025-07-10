const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// 매니저 클래스들 import (느린 버전)
const TaskCodeManager = require('../lib/classes-slow/TaskCodeManager');
const ToolchainManager = require('../lib/classes-slow/ToolchainManager');
const RepositoryManager = require('../lib/classes-slow/RepositoryManager');
const UserManager = require('../lib/classes-slow/UserManager');
const SonarQubeManager = require('../lib/classes-slow/SonarQubeManager');
const JUnitManager = require('../lib/classes-slow/JUnitManager');
const PipelineManager = require('../lib/classes-slow/PipelineManager');
const WorkflowComponentManager = require('../lib/classes-slow/WorkflowComponentManager');
const LoginManager = require('../lib/classes-slow/LoginManager');

// 설정 파일에서 데이터를 읽어오는 함수
function loadTestSettings() {
  const configPath = path.join(__dirname, '../config/test-settings.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // 동적으로 생성되는 값들
  config.repository.group = config.project.code;
  
  return config;
}

// 매니저 클래스들을 초기화하는 함수 (느린 버전)
function initializeManagers(page) {
  const utils = require('../lib/classes-slow/TromboneUtils');
  const tromboneUtils = new utils(page);
  
  return {
    taskCodeManager: new TaskCodeManager(tromboneUtils),
    toolchainManager: new ToolchainManager(tromboneUtils),
    repositoryManager: new RepositoryManager(tromboneUtils),
    userManager: new UserManager(tromboneUtils),
    sonarQubeManager: new SonarQubeManager(tromboneUtils),
    jUnitManager: new JUnitManager(tromboneUtils),
    pipelineManager: new PipelineManager(tromboneUtils),
    workflowComponentManager: new WorkflowComponentManager(tromboneUtils)
  };
}

// 메인 테스트 그룹 (느린 버전)
test.describe.serial('TROMBONE 티켓 사전 데이터 등록 (느린 버전)', () => {
  let page;
  let config;
  let managers;

  // 테스트 시작 전 한 번만 실행 - 로그인 및 초기 설정
  test.beforeAll(async ({ browser }) => {
    config = loadTestSettings();
    
    // 브라우저 페이지 생성
    page = await browser.newPage();
    
    // 로그인 수행 (느린 버전)
    const loginManager = new LoginManager(page);
    await loginManager.login(config);
    
    // 매니저 클래스들 초기화 (느린 버전)
    managers = initializeManagers(page);
    
    // 전역 변수로 설정 (각 단계 파일에서 사용)
    global.config = config;
    global.managers = managers;
  });

  // 테스트 종료 후 정리
  test.afterAll(async () => {
    if (page) {
      await page.close();
    }
    console.log('🏁 모든 테스트가 완료되었습니다. (느린 버전)');
  });

  // 각 단계별 테스트 import 및 실행 (느린 버전)
  require('./steps-slow/step1-taskcode.spec.js');
  require('./steps-slow/step2-toolchain.spec.js');
  require('./steps-slow/step3-repository.spec.js');
  require('./steps-slow/step4-user.spec.js');
  require('./steps-slow/step5-sonarqube.spec.js');
  require('./steps-slow/step6-junit.spec.js');
  require('./steps-slow/step7-pipeline.spec.js');
  require('./steps-slow/step8-workflow.spec.js');
}); 