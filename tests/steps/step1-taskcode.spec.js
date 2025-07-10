const { test, expect } = require('@playwright/test');

// 1단계: 업무 코드 생성
test.describe.serial('1단계', () => {
  test('업무 코드 생성', async () => {
    console.log('📝 1단계: 업무 코드 생성 시작...');
    await global.managers.taskCodeManager.createTaskCode(global.config);
    console.log('✅ 1단계: 업무 코드 생성 완료\n');
  });
}); 