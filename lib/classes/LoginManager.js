// 로그인 관리 클래스
class LoginManager {
  constructor(page) {
    this.page = page;
  }

  async login(config) {
    console.log('🔐 Trombone 로그인 정보:');
    console.log(`아이디: ${config.login.userId}`);
    console.log(`비밀번호: ${config.login.password.replace(/./g, '*')}`);
    console.log('');
    
    console.log('📋 프로젝트 정보:');
    console.log(`프로젝트 코드: ${config.project.code}`);
    console.log(`프로젝트명: ${config.project.name}`);
    console.log(`저장소: ${config.repository.name}`);
    console.log('');
    
    console.log('✅ 설정 파일이 로드되었습니다.\n');

    // 페이지 설정
    await this.page.goto('http://trombone.qa.okestro.cloud/login');
    await this.page.waitForLoadState('networkidle');
    
    await this.page.evaluate(() => {
      window.moveTo(0, 0);
      window.resizeTo(screen.availWidth, screen.availHeight);
    });

    // 로그인
    await this.page.fill('input[name="userId"]', config.login.userId);
    await this.page.fill('input[name="password"]', config.login.password);
    await this.page.click('button:has-text("로그인")');

    // 로그인 성공 확인
    await this.page.waitForURL('http://trombone.qa.okestro.cloud/');
    
    console.log('🚀 로그인이 완료되었습니다.\n');
  }
}

module.exports = LoginManager; 