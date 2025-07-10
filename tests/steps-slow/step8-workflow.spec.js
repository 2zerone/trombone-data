const { test, expect } = require('@playwright/test');

// 8단계: 워크플로우 컴포넌트 등록 (느린 버전)
test.describe.serial('8단계: 워크플로우 컴포넌트 등록 (느린 버전)', () => {
  test('워크플로우 컴포넌트 등록 및 검증', async () => {
    console.log('⚙️ 8단계: 워크플로우 컴포넌트 등록 및 검증 시작... (느린 버전)');
    
    const components = [
      { name: `${global.config.project.code}-결재컴포넌트(결재자)`, buttonIndex: 1, environment: '결재자', envRowIndex: 4 },
      { name: `${global.config.project.code}-파이프라인-STG`, buttonIndex: 2, environment: 'STG', envRowIndex: 3 },
      { name: `${global.config.project.code}-단위테스트`, buttonIndex: 3 },
      { name: `${global.config.project.code}-정적분석`, buttonIndex: 4 },
      { name: `${global.config.project.code}-코드리뷰`, buttonIndex: 5 },
      { name: `${global.config.project.code}-코드병합-STG`, buttonIndex: 6, environment: 'STG', envRowIndex: 3 },
      { name: `${global.config.project.code}-코드병합-PRD`, buttonIndex: 6, environment: 'PRD', envRowIndex: 3 },
      { name: `${global.config.project.code}-통합테스트`, buttonIndex: 8 },
      { name: `${global.config.project.code}-예약배포PRD`, buttonIndex: 10, environment: 'PRD', envRowIndex: 3 }
    ];

    const results = [];
    
    for (const component of components) {
      await test.step(`${component.name} 등록 및 검증`, async () => {
        console.log(`📝 ${component.name} 등록 시작...`);
        
        // 컴포넌트 등록
        await global.managers.workflowComponentManager.createComponent(
          component.name, 
          component.buttonIndex, 
          component.environment, 
          component.envRowIndex
        );
        
        // 등록된 컴포넌트가 목록에 있는지 확인
        const isVerified = await global.managers.workflowComponentManager.verifyComponentInList(component.name);
        results.push({
          componentName: component.name,
          success: isVerified
        });
        
        // 각 단계에서 성공/실패 확인
        expect(isVerified).toBe(true);
        
        console.log(`📊 ${component.name}: ${isVerified ? 'PASS' : 'FAIL'}`);
      });
    }
    
    // 전체 결과 요약
    const passCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    console.log(`\n📈 전체 결과 요약 (느린 버전):`);
    console.log(`✅ PASS: ${passCount}개`);
    console.log(`❌ FAIL: ${failCount}개`);
    console.log(`📊 총 ${results.length}개 중 ${passCount}개 성공`);
    
    console.log('✅ 8단계: 워크플로우 컴포넌트 등록 및 검증 완료 (느린 버전)\n');
  });
}); 