const { test, expect } = require('@playwright/test');

// 4단계: 사용자 등록
test.describe.serial('4단계', () => {
  test('사용자 등록', async () => {
    console.log('👤 4단계: 사용자 등록 시작...');
    await global.managers.userManager.createUser(global.config);
    console.log('✅ 4단계: 사용자 등록 완료\n');
  });
}); 