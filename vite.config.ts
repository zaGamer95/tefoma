import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages *project* page: https://wonbo.site/tefoma/ (커스텀 도메인이지만
  // 프로젝트 페이지라 /tefoma/ 경로는 그대로다). 도메인 루트가 아니므로 이 값이 없으면
  // 에셋 주소가 /assets/... 로 나가면서 배포된 페이지가 빈 화면이 된다.
  base: '/tefoma/',
  plugins: [react()],
})
