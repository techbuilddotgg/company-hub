import { join } from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude],
  },
  resolve: {
    alias: {
      '@utils': join(__dirname, './src/utils/'),
      '@components': './src/components/index.ts',
      '@hooks': './src/hooks/index.ts',
      '@server': join(__dirname, './src/server/'),
      '@constants': join(__dirname, './src/constants/'),
      '@env': './src/env.mjs',
      '@shared': join(__dirname, './src/shared/'),
    },
  },
});
