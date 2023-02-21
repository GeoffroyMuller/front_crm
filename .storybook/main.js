const {mergeConfig} = require('vite');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/vue3",
  "core": {
    "builder": "@storybook/builder-vite"
  },
  "features": {
    "storyStoreV7": true
  },
  async viteFinal(config) {
    console.error(config.css)
    return mergeConfig(config, {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `
              @import "../src/core/assets/style/_variables.scss";
              @import "../src/core/assets/style/_mixins.scss";
              @import "../src/core/assets/style/_functions.scss";
              @import "../src/core/assets/style/_media_mixins.scss";
            `,
          },
        },
      },
    });
},
}