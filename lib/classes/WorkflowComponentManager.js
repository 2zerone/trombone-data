// 워크플로우 컴포넌트 관리 클래스
class WorkflowComponentManager {
  constructor(utils) {
    this.utils = utils;
  }

  async createComponent(componentName, buttonIndex, environment = null, envRowIndex = 3) {
    await this.utils.clickSubMenuOnly('워크플로우 컴포넌트');
    await this.utils.clickRegister();
    
    const buttonSelector = `#root > div > main > div > div.box-content-wrap > div > div.grid-item.col-span-1 > div > button:nth-child(${buttonIndex}) > span`;
    await this.utils.page.waitForSelector(buttonSelector, { state: 'visible' });
    await this.utils.page.click(buttonSelector);
    
    await this.utils.fillInput('[id="wrkflwCompnBsc.compnNm"]', componentName);
    
    if (environment) {
      const envButtonSelector = `#root > div > main > div > div.box-content-wrap > div > div.grid-item.col-span-3 > div > form > div > div.table-wrap.mgt-base > table > tbody > tr:nth-child(${envRowIndex}) > td > div > div > div > button`;
      await this.utils.page.click(envButtonSelector);
      await this.utils.page.click(`text=${environment}`);
    }
    
    await this.utils.saveAndConfirm();
    console.log(`${componentName} 워크플로우 컴포넌트가 정상적으로 등록되었습니다.`);
  }

  // 워크플로우 컴포넌트 목록에서 생성된 데이터 확인
  async verifyComponentInList(componentName) {
    try {
      // 워크플로우 컴포넌트 페이지로 이동 (목록 페이지)
      await this.utils.clickSubMenuOnly('워크플로우 컴포넌트');
      
      // 목록 페이지가 로드될 때까지 대기
      await this.utils.wait(1000);
      
      // 다양한 방법으로 컴포넌트 이름 찾기
      let componentExists = false;
      
      // 방법 1: 일반 텍스트로 찾기
      componentExists = await this.utils.elementExists(`text=${componentName}`);
      
      // 방법 2: 테이블 셀에서 찾기 (테이블 형태인 경우)
      if (!componentExists) {
        componentExists = await this.utils.elementExists(`table td:has-text("${componentName}")`);
      }
      
      // 방법 3: 특정 클래스나 ID를 가진 요소에서 찾기
      if (!componentExists) {
        componentExists = await this.utils.elementExists(`[class*="component"], [class*="list"], [class*="item"]:has-text("${componentName}")`);
      }
      
      // 방법 4: 더 넓은 범위에서 찾기
      if (!componentExists) {
        const allText = await this.utils.page.textContent('body');
        componentExists = allText.includes(componentName);
      }
      
      if (componentExists) {
        console.log(`✅ PASS: ${componentName}이(가) 목록에 정상적으로 표시됩니다.`);
        return true; // PASS
      } else {
        console.log(`❌ FAIL: ${componentName}이(가) 목록에 표시되지 않습니다.`);
        console.log(`🔍 디버깅: 현재 페이지에서 '${componentName}' 텍스트를 찾을 수 없습니다.`);
        
        // 디버깅을 위해 현재 페이지의 텍스트 일부 출력
        try {
          const pageText = await this.utils.page.textContent('body');
          console.log(`📄 현재 페이지 텍스트 (처음 500자): ${pageText.substring(0, 500)}...`);
        } catch (e) {
          console.log('📄 페이지 텍스트 확인 중 오류:', e.message);
        }
        
        return false; // FAIL
      }
    } catch (error) {
      console.log(`❌ FAIL: 컴포넌트 확인 중 오류 발생: ${error.message}`);
      return false; // FAIL
    }
  }

  // 여러 컴포넌트를 등록하고 모두 확인
  async createAndVerifyComponents(config) {
    const components = [
      { name: `${config.project.code}-결재컴포넌트(결재자)`, buttonIndex: 1, environment: '결재자', envRowIndex: 4 },
      { name: `${config.project.code}-파이프라인-STG`, buttonIndex: 2, environment: 'STG', envRowIndex: 3 },
      { name: `${config.project.code}-단위테스트`, buttonIndex: 3 },
      { name: `${config.project.code}-정적분석`, buttonIndex: 4 },
      { name: `${config.project.code}-코드리뷰`, buttonIndex: 5 },
      { name: `${config.project.code}-코드병합-STG`, buttonIndex: 6, environment: 'STG', envRowIndex: 3 },
      { name: `${config.project.code}-코드병합-PRD`, buttonIndex: 6, environment: 'PRD', envRowIndex: 3 },
      { name: `${config.project.code}-통합테스트`, buttonIndex: 8 },
      { name: `${config.project.code}-예약배포PRD`, buttonIndex: 10, environment: 'PRD', envRowIndex: 3 }
    ];

    const results = [];

    for (const component of components) {
      console.log(`\n📝 ${component.name} 등록 시작...`);
      
      // 컴포넌트 등록
      await this.createComponent(
        component.name, 
        component.buttonIndex, 
        component.environment, 
        component.envRowIndex
      );
      
      // 등록된 컴포넌트가 목록에 있는지 확인
      const isVerified = await this.verifyComponentInList(component.name);
      results.push({
        componentName: component.name,
        success: isVerified
      });
      
      console.log(`📊 ${component.name}: ${isVerified ? 'PASS' : 'FAIL'}`);
    }

    // 전체 결과 요약
    const passCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`\n📈 전체 결과 요약:`);
    console.log(`✅ PASS: ${passCount}개`);
    console.log(`❌ FAIL: ${failCount}개`);
    console.log(`📊 총 ${results.length}개 중 ${passCount}개 성공`);
    
    return {
      results,
      totalCount: results.length,
      passCount,
      failCount,
      allPassed: failCount === 0
    };
  }
}

module.exports = WorkflowComponentManager; 