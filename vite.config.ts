import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // server: {
  //   host: "0.0.0.0",
  //   fs: {
  //     strict: false
  //   },
  // },
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.wav', '**/*.mp3', '**/*.ogg'],
})
