const { test, expect } = require('@playwright/test');

// 5단계: SonarQube 등록
test.describe.serial('5단계', () => {
  test('SonarQube 등록', async () => {
    console.log('🔍 5단계: SonarQube 등록 시작...');
    await global.managers.sonarQubeManager.createSonarQube(global.config);
    console.log('✅ 5단계: SonarQube 등록 완료\n');
  });
}); 