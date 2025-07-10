// 업무 코드 관리 클래스 (느린 버전)
class TaskCodeManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createTaskCode(config) {
    await this.utils.clickSubMenuFirst('즐겨찾기0 0 24', '업무 코드');
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    await this.utils.clickRegister();

    const exists = await this.utils.elementExists(`text=${config.project.code}`);
    
    if (!exists) {
      await this.utils.fillInput('#taskCd', config.project.code);
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      await this.utils.fillInput('#taskNm', config.project.name);
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      await this.utils.saveAndConfirm();
      await this.utils.wait(5000);
      console.log(`${config.project.code} 업무코드를 등록했습니다.`);
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${config.project.code} 업무코드가 이미 존재합니다.`);
    }
  }
}

module.exports = TaskCodeManager; 