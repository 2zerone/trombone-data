// JUnit 관리 클래스 (느린 버전)
class JUnitManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createJUnit(config) {
    await this.utils.clickSubMenuOnly('JUnit 관리');
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    await this.utils.clickRegister();

    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > div > div > input', taskCodeText);
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > div > div > input', config.repository.name);
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가

    const exists = await this.utils.elementExists(`text=${config.repository.name}`);
    
    if (exists) {
      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > div > button');
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      await this.utils.page.click('text=Maven');
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(4) > div > div > div > div > div > button');
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      await this.utils.page.click('text=LYH_자동화테스트');
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가

      await this.utils.page.click('#root > div > main > div > div.box-content-wrap > div.flex.col > div.flex.col > div > div > section > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text');
      await this.utils.page.keyboard.type(`mvn test
pwd
ls target/surefire-reports`);
      
      await this.utils.saveAndConfirm();
      console.log('JUnit이 정상적으로 등록되었습니다.');
      await this.utils.wait(5000); // 원래 코드와 동일
    } else {
      await this.utils.cancelAndConfirm();
      console.log('해당 저장소가 이미 JUnit에 등록되어 있습니다.');
      await this.utils.wait(1000); // 원래 코드와 동일
    }
  }
}

module.exports = JUnitManager; 