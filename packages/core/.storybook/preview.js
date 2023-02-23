import { app } from '@storybook/vue3';
import setup from '../src/setup';

setup({app, routes: []});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}