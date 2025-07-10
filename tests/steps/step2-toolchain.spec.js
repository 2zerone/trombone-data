const { test, expect } = require('@playwright/test');

// 2단계: 툴체인에 업무코드 등록
test.describe.serial('2단계', () => {
  test('툴체인에 업무코드 등록', async () => {
    console.log('🔧 2단계: 툴체인에 업무코드 등록 시작...');
    await global.managers.toolchainManager.addTaskCodeToToolchain(global.config);
    console.log('✅ 2단계: 툴체인에 업무코드 등록 완료\n');
  });
}); 