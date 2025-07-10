// 사용자 관리 클래스
class UserManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createUser(config) {
    await this.utils.clickSubMenuOnly('사용자 정보 관리');
    await this.utils.clickRegister();

    // 기본 정보 입력
    await this.utils.fillInput('input[placeholder="아이디를 입력해주세요"]', config.user.id);
    await this.utils.fillInput('input[placeholder="이름을 입력해주세요"]', config.user.name);
    await this.utils.fillInput('input[placeholder="이메일을 입력해주세요"]', config.user.email);
    
    const selectInputs = this.utils.page.locator('input[placeholder="선택"]');
    await selectInputs.nth(1).fill(config.user.level);

    // 티켓 전용 업무 및 역할
    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('input[placeholder="업무코드 선택"]', taskCodeText);
    await this.utils.fillInput('input[placeholder="티켓 역할 선택"]', config.user.role);
    await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div:nth-child(3) > form > div > div.dashboard-title > div.elem-group > button > span > span');

    // 사용자 업무 및 역할
    const selectCodeInputs = this.utils.page.locator('input[placeholder="업무코드 선택"]');
    await selectCodeInputs.nth(1).fill(taskCodeText);
    await this.utils.fillInput('input[placeholder="사용자 역할 선택"]', config.user.systemRole);
    await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div:nth-child(4) > form > div > div.dashboard-title > div.elem-group > button > span > span');

    // 사용자 구분 선택
    const userTypeButton = '#root > div > main > div > div.box-content-wrap > form > div:nth-child(7) > div > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > button';
    await this.utils.page.click(userTypeButton);
    await this.utils.page.click('text=직원');

    // 저장 버튼 상태 확인
    const saveButton = this.utils.page.locator('button:has-text("저장")');
    
    // 저장 버튼이 안정화될 때까지 기다림 (최대 3초)
    let isEnabled = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      isEnabled = await saveButton.isEnabled();
      await this.utils.page.waitForTimeout(300);
      const newIsEnabled = await saveButton.isEnabled();
      
      // 상태가 안정화되면 (연속 2번 같은 상태) 루프 종료
      if (isEnabled === newIsEnabled) {
        break;
      }
      
      isEnabled = newIsEnabled;
      attempts++;
    }
    
    if (isEnabled) {
      await this.utils.saveAndConfirm();
      await this.utils.wait(5000);
      console.log('사용자가 정상적으로 등록되었습니다.');
    } else {
      await this.utils.cancelAndConfirm();
      console.log('이미 등록된 사용자입니다.');
    }
  }
}

module.exports = UserManager; 