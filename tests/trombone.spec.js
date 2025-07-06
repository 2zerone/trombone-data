const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// 설정 파일에서 데이터를 읽어오는 함수
function loadTestSettings() {
  const configPath = path.join(__dirname, '../config/test-settings.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  // 동적으로 생성되는 값들
  config.repository.group = config.project.code;
  
  return config;
}

// 유틸리티 클래스
class TromboneUtils {
  constructor(page) {
    this.page = page;
  }

  // 공통 대기 시간 - 원래 코드와 동일하게 2초
  async wait(ms = 2000) {
    await this.page.waitForTimeout(ms);
  }

  // 메뉴 클릭 - 원래 코드와 동일한 타이밍
  async clickMenu(menuText) {
    await this.page.waitForSelector(`text=${menuText}`, { state: 'visible' });
    await this.page.getByText(menuText).click();
    await this.wait(2000); // 원래 코드와 동일
  }

  // 메뉴 클릭 (first 사용) - JUnit 관리용
  async clickMenuFirst(menuText) {
    await this.page.waitForSelector(`text=${menuText}`, { state: 'visible' });
    await this.page.getByText(menuText).first().click();
    await this.wait(2000); // 원래 코드와 동일
  }

  // 즐겨찾기 메뉴 클릭 후 서브메뉴 클릭 - 원래 코드와 동일한 타이밍
  async clickSubMenu(favoriteText, subMenuText) {
    await this.clickMenu(favoriteText);
    await this.clickMenu(subMenuText);
  }

  // 즐겨찾기 메뉴 클릭 후 서브메뉴 클릭 (first 사용) - JUnit 관리용
  async clickSubMenuFirst(favoriteText, subMenuText) {
    await this.clickMenu(favoriteText);
    await this.clickMenuFirst(subMenuText);
  }

  // 등록 버튼 클릭 - 원래 코드와 동일한 타이밍
  async clickRegister() {
    await this.page.waitForSelector('text=등록', { state: 'visible' });
    await this.page.getByText('등록', { exact: true }).click();
    await this.wait(2000); // 원래 코드와 동일
  }

  // 저장 및 확인 - 원래 코드와 동일한 타이밍
  async saveAndConfirm() {
    await this.page.click('button:has-text("저장")');
    await this.wait(2000); // 원래 코드와 동일
    await this.page.click('button:has-text("확인")');
    await this.wait(2000); // 원래 코드와 동일
  }

  // 취소 및 확인 - 원래 코드와 동일한 타이밍
  async cancelAndConfirm() {
    await this.page.click('button:has-text("취소")');
    await this.wait(2000); // 원래 코드와 동일
    await this.page.click('button:has-text("확인")');
    await this.wait(2000); // 원래 코드와 동일
  }

  // 요소 존재 여부 확인
  async elementExists(selector) {
    return await this.page.locator(selector).count() > 0;
  }

  // 입력 필드 채우기 - 원래 코드와 동일한 타이밍
  async fillInput(selector, value) {
    await this.page.waitForSelector(selector, { state: 'visible' });
    await this.page.fill(selector, value);
    await this.wait(2000); // 원래 코드와 동일
  }

  // 모나코 에디터에 텍스트 입력 - 원래 코드와 동일한 타이밍
  async fillMonacoEditor(content) {
    // 클립보드에 복사
    await this.page.evaluate((text) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }, content);

    // 에디터 클릭 후 붙여넣기
    const editorSelector = '#root > div > main > div > div.box-content-wrap > form > div > div > div.flex.col > div.grid.cols-1 > div > div > div > section > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text';
    await this.page.click(editorSelector);
    await this.page.keyboard.press('Control+a');
    await this.page.keyboard.press('Backspace');
    await this.page.keyboard.press('Control+v');
    await this.wait(2000); // 원래 코드와 동일
  }
}

// 업무 코드 관리 클래스
class TaskCodeManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createTaskCode(config) {
    await this.utils.clickSubMenuFirst('즐겨찾기0 0 24', '업무 코드');
    await this.utils.clickRegister();

    const exists = await this.utils.elementExists(`text=${config.project.code}`);
    
    if (!exists) {
      await this.utils.fillInput('#taskCd', config.project.code);
      await this.utils.fillInput('#taskNm', config.project.name);
      await this.utils.saveAndConfirm();
      console.log(`${config.project.code} 업무코드를 등록했습니다.`);
      await this.utils.wait(2000); // 원래 코드와 동일
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${config.project.code} 업무코드가 이미 존재합니다.`);
      await this.utils.wait(2000); // 원래 코드와 동일
    }
  }
}

// 툴체인 관리 클래스
class ToolchainManager {
  constructor(utils) {
    this.utils = utils;
  }

  async addTaskCodeToToolchain(config) {
    await this.utils.clickSubMenu('즐겨찾기0 0 24', '툴체인 관리');
    
    const manageButton = '#root > div > main > div > div.box-content-wrap > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td.tac.not-last.tac > button';
    await this.utils.page.waitForSelector(manageButton, { state: 'visible' });
    await this.utils.page.click(manageButton);
    await this.utils.wait(2000); // 원래 코드와 동일

    await this.utils.page.click('input[placeholder="선택"]');
    await this.utils.wait(2000); // 원래 코드와 동일

    const taskCodeText = `${config.project.name}(${config.project.code})`;
    const exists = await this.utils.elementExists(`text=${taskCodeText}`);
    
    if (exists) {
      await this.utils.page.click(`text=${taskCodeText}`);
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.saveAndConfirm();
      console.log(`${taskCodeText}를 툴체인에 추가했습니다.`);
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${taskCodeText}가 이미 툴체인에 추가되어 있습니다.`);
    }

    await this.utils.wait(2000); // 원래 코드와 동일
  }
}

// 저장소 관리 클래스
class RepositoryManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createRepository(config) {
    await this.utils.clickSubMenu('즐겨찾기0 0 24', '그룹 및 저장소 관리');
    await this.utils.clickRegister();

    const exists = await this.utils.elementExists(`text=${config.repository.name}`);
    
    if (!exists) {
      await this.utils.fillInput('input[placeholder="그룹을 선택하세요."]', config.project.code);
      await this.utils.fillInput('#bizNm', config.repository.name);
      
      const saveButton = this.utils.page.locator('button:has-text("저장")');
      const isEnabled = await saveButton.isEnabled();
      
      if (isEnabled) {
        await this.utils.saveAndConfirm();
        console.log(`${config.repository.name} 저장소를 등록했습니다.`);
      } else {
        await this.utils.cancelAndConfirm();
        console.log(`${config.repository.name} 저장소가 이미 존재합니다.`);
      }
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${config.repository.name} 저장소가 이미 존재합니다.`);
    }
    
    await this.utils.wait(2000); // 원래 코드와 동일
  }
}

// 사용자 관리 클래스
class UserManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createUser(config) {
    await this.utils.clickSubMenu('즐겨찾기0 0 24', '사용자 정보 관리');
    await this.utils.clickRegister();

    // 기본 정보 입력
    await this.utils.fillInput('input[placeholder="아이디를 입력해주세요"]', config.user.id);
    await this.utils.fillInput('input[placeholder="이름을 입력해주세요"]', config.user.name);
    await this.utils.fillInput('input[placeholder="이메일을 입력해주세요"]', config.user.email);
    
    const selectInputs = this.utils.page.locator('input[placeholder="선택"]');
    await selectInputs.nth(1).fill(config.user.level);
    await this.utils.wait(2000); // 원래 코드와 동일

    // 티켓 전용 업무 및 역할
    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('input[placeholder="업무코드 선택"]', taskCodeText);
    await this.utils.fillInput('input[placeholder="티켓 역할 선택"]', config.user.role);
    await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div:nth-child(3) > form > div > div.dashboard-title > div.elem-group > button > span > span');
    await this.utils.wait(2000); // 원래 코드와 동일

    // 사용자 업무 및 역할
    const selectCodeInputs = this.utils.page.locator('input[placeholder="업무코드 선택"]');
    await selectCodeInputs.nth(1).fill(taskCodeText);
    await this.utils.wait(2000); // 원래 코드와 동일
    await this.utils.fillInput('input[placeholder="사용자 역할 선택"]', config.user.systemRole);
    await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div:nth-child(4) > form > div > div.dashboard-title > div.elem-group > button > span > span');
    await this.utils.wait(2000); // 원래 코드와 동일

    // 사용자 구분 선택
    const userTypeButton = '#root > div > main > div > div.box-content-wrap > form > div:nth-child(7) > div > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > button';
    await this.utils.page.click(userTypeButton);
    await this.utils.wait(2000); // 원래 코드와 동일
    await this.utils.page.click('text=직원');
    await this.utils.wait(2000); // 원래 코드와 동일

    const saveButton = this.utils.page.locator('button:has-text("저장")');
    const isEnabled = await saveButton.isEnabled();
    
    if (isEnabled) {
      await this.utils.saveAndConfirm();
      console.log('사용자가 정상적으로 등록되었습니다.');
    } else {
      await this.utils.cancelAndConfirm();
      console.log('이미 등록된 사용자입니다.');
    }

    await this.utils.wait(2000); // 원래 코드와 동일
  }
}

// SonarQube 관리 클래스
class SonarQubeManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createSonarQube(config) {
    await this.utils.clickSubMenu('즐겨찾기0 0 24', 'SonarQube 관리');
    await this.utils.clickRegister();

    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > form > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input', taskCodeText);
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > form > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > div > div > input', config.repository.name);

    const exists = await this.utils.elementExists(`text=${config.repository.name}`);
    
    if (exists) {
      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > div > button');
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click('text=소나큐브');
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(4) > div > div > div > div > div > button');
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click('text=LYH_자동화테스트');
      await this.utils.wait(2000); // 원래 코드와 동일

      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div > div.flex.col > div.flex.col > div > div > section > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text');
      await this.utils.page.keyboard.type('mvn clean verify sonar:sonar');
      await this.utils.wait(2000); // 원래 코드와 동일
      
      await this.utils.saveAndConfirm();
      console.log('SonarQube가 정상적으로 등록되었습니다.');
      await this.utils.wait(10000); // 원래 코드와 동일
    } else {
      await this.utils.cancelAndConfirm();
      console.log('해당 저장소가 이미 SonarQube에 등록되어 있습니다.');
      await this.utils.wait(3000); // 원래 코드와 동일
    }
  }
}

// JUnit 관리 클래스
class JUnitManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createJUnit(config) {
    await this.utils.clickSubMenuFirst('즐겨찾기0 0 24', 'JUnit 관리');
    await this.utils.clickRegister();

    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input', taskCodeText);
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > div > div > input', config.repository.name);

    const exists = await this.utils.elementExists(`text=${config.repository.name}`);
    
    if (exists) {
      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > div > button');
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click('text=Maven');
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(4) > div > div > div > div > div > button');
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click('text=LYH_자동화테스트');
      await this.utils.wait(2000); // 원래 코드와 동일

      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > div.flex.col > div.flex.col > div > div > section > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text');
      await this.utils.page.keyboard.type(`mvn test
pwd
ls target/surefire-reports`);
      await this.utils.wait(2000); // 원래 코드와 동일
      
      await this.utils.saveAndConfirm();
      console.log('JUnit이 정상적으로 등록되었습니다.');
      await this.utils.wait(10000); // 원래 코드와 동일
    } else {
      await this.utils.cancelAndConfirm();
      console.log('해당 저장소가 이미 JUnit에 등록되어 있습니다.');
      await this.utils.wait(3000); // 원래 코드와 동일
    }
  }
}

// 파이프라인 관리 클래스
class PipelineManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createPipeline(pipelineName, environment, pipelineFile, config) {
    await this.utils.clickSubMenu('즐겨찾기0 0 24', '파이프라인 관리');
    await this.utils.clickRegister();

    await this.utils.fillInput('#pplnNm', pipelineName);
    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > form > div > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > div > div > input', taskCodeText);
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > form > div > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > div > input', config.repository.name);
    await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(4) > div > div > div > button');
    await this.utils.wait(2000); // 원래 코드와 동일
    
    const exists = await this.utils.elementExists(`text=${environment}`);
    
    if (exists) {
      await this.utils.page.click(`text=${environment}`);
      await this.utils.wait(2000); // 원래 코드와 동일
      
      const pipelineContent = fs.readFileSync(pipelineFile, 'utf8');
      await this.utils.fillMonacoEditor(pipelineContent);
      
      await this.utils.saveAndConfirm();
      console.log(`${environment} 파이프라인이 정상적으로 등록되었습니다.`);
      await this.utils.wait(10000); // 원래 코드와 동일
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${environment}가 목록에 없습니다.`);
      await this.utils.wait(3000); // 원래 코드와 동일
    }
  }
}

// 워크플로우 컴포넌트 관리 클래스
class WorkflowComponentManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createComponent(componentName, buttonIndex, environment = null) {
    await this.utils.clickSubMenu('즐겨찾기0 0 24', '워크플로우 컴포넌트');
    await this.utils.clickRegister();
    
    const buttonSelector = `#root > div > main > div > div.box-content-wrap > div > div.grid-item.col-span-1 > div > button:nth-child(${buttonIndex}) > span`;
    await this.utils.page.waitForSelector(buttonSelector, { state: 'visible' });
    await this.utils.page.click(buttonSelector);
    await this.utils.wait(2000); // 원래 코드와 동일
    
    await this.utils.fillInput('[id="wrkflwCompnBsc.compnNm"]', componentName);
    await this.utils.wait(2000); // 원래 코드와 동일
    
    if (environment) {
      const envButtonSelector = '#root > div > main > div > div.box-content-wrap > div > div.grid-item.col-span-3 > div > form > div > div.table-wrap.mgt-base > table > tbody > tr:nth-child(3) > td > div > div > div > button';
      await this.utils.page.click(envButtonSelector);
      await this.utils.wait(2000); // 원래 코드와 동일
      await this.utils.page.click(`text=${environment}`);
      await this.utils.wait(2000); // 원래 코드와 동일
    }
    
    await this.utils.saveAndConfirm();
    console.log(`${componentName} 워크플로우 컴포넌트가 정상적으로 등록되었습니다.`);
    await this.utils.wait(2000); // 원래 코드와 동일
  }
}

// 메인 테스트
test('TROMBONE 티켓 사전 데이터 등록 시작', async ({ page }) => {
  // 설정 파일에서 데이터 로드
  const config = loadTestSettings();
  
  console.log('🔐 Trombone 로그인 정보:');
  console.log(`아이디: ${config.login.userId}`);
  console.log(`비밀번호: ${config.login.password.replace(/./g, '*')}`);
  console.log('');
  
  console.log('📋 프로젝트 정보:');
  console.log(`프로젝트 코드: ${config.project.code}`);
  console.log(`프로젝트명: ${config.project.name}`);
  console.log(`저장소: ${config.repository.name}`);
  console.log('');
  
  console.log('✅ 설정 파일이 로드되었습니다.\n');
  
  // 페이지 설정 - 원래 코드와 동일한 타이밍
  await page.goto('http://trombone.qa.okestro.cloud/login');
  await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  await page.evaluate(() => {
    window.moveTo(0, 0);
    window.resizeTo(screen.availWidth, screen.availHeight);
  });
  await page.waitForTimeout(2000);

  // 로그인 - 설정 파일에서 가져온 값 사용
  await page.fill('input[name="userId"]', config.login.userId);
  await page.waitForTimeout(2000);
  await page.fill('input[name="password"]', config.login.password);
  await page.waitForTimeout(2000);
  await page.click('button:has-text("로그인")');
  await page.waitForTimeout(2000);

  await expect(page).toHaveURL('http://trombone.qa.okestro.cloud/');
  await page.waitForTimeout(2000);
  
  // 유틸리티 및 매니저 클래스 초기화
  const utils = new TromboneUtils(page);
  const taskCodeManager = new TaskCodeManager(utils);
  const toolchainManager = new ToolchainManager(utils);
  const repositoryManager = new RepositoryManager(utils);
  const userManager = new UserManager(utils);
  const sonarQubeManager = new SonarQubeManager(utils);
  const jUnitManager = new JUnitManager(utils);
  const pipelineManager = new PipelineManager(utils);
  const workflowComponentManager = new WorkflowComponentManager(utils);

  // 1. 업무 코드 생성
  await taskCodeManager.createTaskCode(config);

  // 2. 툴체인에 업무코드 등록
  await toolchainManager.addTaskCodeToToolchain(config);

  // 3. 업무코드에 저장소 생성
  await repositoryManager.createRepository(config);
  
  // 4. 사용자 등록
  await userManager.createUser(config);

  // 5. SonarQube 등록
  await sonarQubeManager.createSonarQube(config);

  // 6. JUnit 등록
  await jUnitManager.createJUnit(config);

  // 7. 파이프라인 등록
  await pipelineManager.createPipeline(`${config.project.code}-STG`, 'STG', './tests/pipeline-stg.txt', config);
  await pipelineManager.createPipeline(`${config.project.code}-PRD`, 'PRD', './tests/pipeline-prd.txt', config);

  // 8. 워크플로우 컴포넌트 등록
  await workflowComponentManager.createComponent(`${config.project.code}-결재컴포넌트(결재자)`, 1, '결재자');
  await workflowComponentManager.createComponent(`${config.project.code}-파이프라인-STG`, 2, 'STG');
  await workflowComponentManager.createComponent(`${config.project.code}-단위테스트`, 3);
  await workflowComponentManager.createComponent(`${config.project.code}-정적분석`, 4);
  await workflowComponentManager.createComponent(`${config.project.code}-코드리뷰`, 5);
  await workflowComponentManager.createComponent(`${config.project.code}-코드병합-STG`, 6, 'STG');
  await workflowComponentManager.createComponent(`${config.project.code}-코드병합-PRD`, 6, 'PRD');
  await workflowComponentManager.createComponent(`${config.project.code}-통합테스트`, 8);
  await workflowComponentManager.createComponent(`${config.project.code}-예약배포PRD`, 10, 'PRD');

  await page.waitForTimeout(2000); // 원래 코드와 동일
}); 