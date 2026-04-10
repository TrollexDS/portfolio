

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
"addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-designs"
  ],
  "framework": "@storybook/vue3-vite"
};
export default config;