import '../src/styles/tokens.css'

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'Light',
      values: [
        { name: 'Light', value: '#f5f5f5' },
        { name: 'Dark', value: '#1a1a2e' },
      ],
    },
  },
  decorators: [
    (story, context) => {
      const bg = context.globals?.backgrounds?.value
      const isDark = bg === '#1a1a2e'
      if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      return story()
    },
  ],
}

export default preview
