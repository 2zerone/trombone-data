// 툴체인 관리 클래스 (느린 버전)
class ToolchainManager {
  constructor(utils) {
    this.utils = utils;
  }

  async addTaskCodeToToolchain(config) {
    await this.utils.clickSubMenuOnly('툴체인 관리');
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    
    const manageButton = '#root > div > main > div > div.box-content-wrap > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td.tac.not-last.tac > button';
    await this.utils.page.waitForSelector(manageButton, { state: 'visible' });
    await this.utils.page.click(manageButton);
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가

    await this.utils.page.click('input[placeholder="선택"]');
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가

    const taskCodeText = `${config.project.name}(${config.project.code})`;
    const exists = await this.utils.elementExists(`text=${taskCodeText}`);
    
    if (exists) {
      await this.utils.page.click(`text=${taskCodeText}`);
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      await this.utils.saveAndConfirm();
      console.log(`${taskCodeText}를 툴체인에 추가했습니다.`);
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${taskCodeText}가 이미 툴체인에 추가되어 있습니다.`);
    }
  }
}

module.exports = ToolchainManager; 