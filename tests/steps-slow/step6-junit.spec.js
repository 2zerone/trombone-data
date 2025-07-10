const { test, expect } = require('@playwright/test');

// 6단계: JUnit 등록 (느린 버전)
test.describe.serial('6단계: JUnit 등록 (느린 버전)', () => {
  test('JUnit 등록', async () => {
    console.log('🧪 6단계: JUnit 등록 시작... (느린 버전)');
    await global.managers.jUnitManager.createJUnit(global.config);
    console.log('✅ 6단계: JUnit 등록 완료 (느린 버전)\n');
  });
}); 