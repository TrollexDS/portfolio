

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-designs"
  ],
  framework: "@storybook/vue3-vite",
  staticDirs: [
    { from: "../src/assets/icons", to: "/src/assets/icons" },
    { from: "../src/assets/images", to: "/src/assets/images" },
    { from: "../src/assets/logos", to: "/src/assets/logos" },
  ],
};
export default config;