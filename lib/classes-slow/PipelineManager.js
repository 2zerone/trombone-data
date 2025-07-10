const fs = require('fs');

// 파이프라인 관리 클래스 (느린 버전)
class PipelineManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createPipeline(pipelineName, environment, pipelineFile, config) {
    await this.utils.clickSubMenuOnly('파이프라인 관리');
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    await this.utils.clickRegister();

    await this.utils.fillInput('#pplnNm', pipelineName);
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    const taskCodeText = `${config.project.name}(${config.project.code})`;
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > form > div > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(1) > td:nth-child(4) > div > div > div > input', taskCodeText);
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    await this.utils.fillInput('#root > div > main > div > div.box-content-wrap > form > div > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > div > div > input', config.repository.name);
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    await this.utils.page.click('#root > div > main > div > div.box-content-wrap > form > div > div > div:nth-child(1) > div.table-wrap.mgt-base > table > tbody > tr:nth-child(2) > td:nth-child(4) > div > div > div > button');
    await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
    
    const exists = await this.utils.elementExists(`text=${environment}`);
    
    if (exists) {
      await this.utils.page.click(`text=${environment}`);
      await this.utils.page.waitForTimeout(2000); // 2초 딜레이 추가
      
      const pipelineContent = fs.readFileSync(pipelineFile, 'utf8');
      await this.utils.fillMonacoEditor(pipelineContent);
      
      await this.utils.saveAndConfirm();
      console.log(`${environment} 파이프라인이 정상적으로 등록되었습니다.`);
      await this.utils.wait(5000); // 원래 코드와 동일
    } else {
      await this.utils.cancelAndConfirm();
      console.log(`${environment} 파이프라인이 이미 등록되어 있습니다.`);
      await this.utils.wait(1000); // 원래 코드와 동일
    }
  }
}

module.exports = PipelineManager; 