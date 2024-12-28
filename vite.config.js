import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],


  server: {
    host: '0.0.0.0',
    port: 8089,
    // 配置了一个ollama的代理规则 代理到本机解决跨域问题
    proxy: {
      // 代理规则
      '/api': {
        target: 'http://127.0.0.1:11434', // 目标 API 服务器地址
        changeOrigin: true, // 更改请求源为目标地址
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
