// 저장소 관리 클래스
class RepositoryManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createRepository(config) {
    await this.utils.clickSubMenuOnly('그룹 및 저장소 관리');
    await this.utils.clickRegister();

    const exists = await this.utils.elementExists(`text=${config.repository.name}`);
    
    if (!exists) {
      await this.utils.fillInput('input[placeholder="그룹을 선택하세요."]', config.project.code);
      await this.utils.fillInput('#bizNm', config.repository.name);
      
      // 입력 완료 후 저장 버튼이 활성화될 때까지 잠시 대기
      await this.utils.page.waitForTimeout(500);
      
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
        console.log(`${config.repository.name} 저장소를 등록했습니다.`);
        await this.utils.wait(5000);
      } else {
        await this.utils.cancelAndConfirm();
        console.log(`${config.repository.name} 저장소 등록을 취소했습니다.`);
      }
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${config.repository.name} 저장소가 이미 존재합니다.`);
    }
  }
}

module.exports = RepositoryManager; 