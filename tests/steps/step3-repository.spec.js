const { test, expect } = require('@playwright/test');

// 3단계: 저장소 생성
test.describe.serial('3단계', () => {
  test('업무코드에 저장소 생성', async () => {
    console.log('📦 3단계: 저장소 생성 시작...');
    await global.managers.repositoryManager.createRepository(global.config);
    console.log('✅ 3단계: 저장소 생성 완료\n');
  });
}); 