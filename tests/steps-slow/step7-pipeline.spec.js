const { test, expect } = require('@playwright/test');

// 7단계: 파이프라인 등록 (느린 버전)
test.describe.serial('7단계: 파이프라인 등록 (느린 버전)', () => {
  test('파이프라인 등록', async () => {
    console.log('🔄 7단계: 파이프라인 등록 시작... (느린 버전)');
    await global.managers.pipelineManager.createPipeline(`${global.config.project.code}-STG`, 'STG', './tests/pipeline-stg.txt', global.config);
    await global.managers.pipelineManager.createPipeline(`${global.config.project.code}-PRD`, 'PRD', './tests/pipeline-prd.txt', global.config);
    console.log('✅ 7단계: 파이프라인 등록 완료 (느린 버전)\n');
  });
}); 