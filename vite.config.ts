import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages *project* page: https://wonbo.site/tefoma/ (커스텀 도메인이지만
  // 프로젝트 페이지라 /tefoma/ 경로는 그대로다). 도메인 루트가 아니므로 이 값이 없으면
  // 에셋 주소가 /assets/... 로 나가면서 배포된 페이지가 빈 화면이 된다.
  base: '/tefoma/',
  plugins: [react()],
  build: {
    // 기본값으로 두면 미디어 쿼리가 @media (width>=1024px) 범위 문법으로 압축된다.
    // Safari 16.4 미만에서는 이 문법을 못 읽어 데스크톱 레이아웃이 통째로 무시된다.
    // 아래로 낮춰 (min-width: 1024px) 형태를 유지한다.
    cssTarget: 'chrome87',
  },
})
