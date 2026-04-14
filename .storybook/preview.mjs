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
      default: 'light',
      options: {
        light: { name: 'Light', value: '#f5f5f5' },
        dark:  { name: 'Dark',  value: '#1a1a2e' },
      },
    },
  },
  decorators: [
    (story, context) => {
      /* Storybook 10 stores the selected background key in
         globals.backgrounds as a string (e.g. "dark") or
         an object { value: "dark" }.                        */
      const raw = context.globals?.backgrounds
      const key = typeof raw === 'string' ? raw : raw?.value

      const isDark = key === 'dark'

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
