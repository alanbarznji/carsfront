import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  server: {
    proxy: {
      // أي طلب يبدأ بـ /api يروح للـ backend
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        // إذا تريد تحذف البادئة /api عند الإرسال للـ server:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
