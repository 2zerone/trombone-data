const { test, expect } = require('@playwright/test');

// 3단계: 저장소 등록 (느린 버전)
test.describe.serial('3단계: 저장소 등록 (느린 버전)', () => {
  test('저장소 등록', async () => {
    console.log('📁 3단계: 저장소 등록 시작... (느린 버전)');
    await global.managers.repositoryManager.createRepository(global.config);
    console.log('✅ 3단계: 저장소 등록 완료 (느린 버전)\n');
  });
}); 