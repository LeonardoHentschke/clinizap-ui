import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

dotenv.config();

const dependencyNames = [
  '@clinicaexperts',
  'bulma',
  'typeface-barlow',
  'typeface-merriweather',
  'typeface-oxygen-mono',
  'typeface-ibm-plex-mono',
  'tippy.js',
  'material-icons',
  'prosemirror-image-plugin',
  'vue-multiselect',
  'vue3-timepicker',
];

const resolveAliases = Object.fromEntries(
  dependencyNames.map((name) => [
    `~${name}`,
    path.resolve(__dirname, `node_modules/${name}`),
  ]),
);

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      ...resolveAliases,
    },
  },
  define: {
    'process.env': process.env
  }
});
