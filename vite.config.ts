import path from 'path';
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode }) => {
  const rootDir = path.resolve(__dirname);
  const srcDir = path.resolve(__dirname, 'src');
  const env = loadEnv(mode, process.cwd(), '');
  const production = env.NODE_ENV === 'production';

  return {
    base: '/xahod-admin/',
    appType: 'spa',
    plugins: [
      vue(),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer(),
          tailwind(),
        ],
      },
    },
    resolve: {
      alias: {
        '@': srcDir,
        '@/registry/new-york/ui/': path.resolve(__dirname, 'new_ui_framework_shadcn_vue/src/registry/new-york/ui/'),
      }
    },
    build: {
      minify: production,
      sourcemap: production,
      outDir: path.resolve(__dirname, 'dist'),
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
    },
    optimizeDeps: {
      include: [
        '@/registry/new-york/ui/button',
        '@/registry/new-york/ui/card',
        '@/registry/new-york/ui/tabs',
        '@/registry/new-york/ui/input',
        '@/registry/new-york/ui/avatar',
      ],
    },
  }
});
