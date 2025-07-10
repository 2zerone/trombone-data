const { test, expect } = require('@playwright/test');

// 1단계: 업무 코드 등록 (느린 버전)
test.describe.serial('1단계: 업무 코드 등록 (느린 버전)', () => {
  test('업무 코드 등록', async () => {
    console.log('📋 1단계: 업무 코드 등록 시작... (느린 버전)');
    await global.managers.taskCodeManager.createTaskCode(global.config);
    console.log('✅ 1단계: 업무 코드 등록 완료 (느린 버전)\n');
  });
}); 