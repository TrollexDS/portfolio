import { h } from 'vue'
import NavBar from '../components/NavBar.js'
import './storybook-nav.css'

export default {
  title: 'Foundation/NavBar',
  component: NavBar,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/z8dToxFCYzuNWAEZ3BIIqH/Portfolio---Design-System?node-id=12-15',
    },
  },
}

export const Default = {
  render: () => ({
    components: { NavBar },
    setup: () => () =>
      h('div', {
        style: {
          background: 'var(--color-bg-body, #f0ede8)',
          minHeight: '400px',
          paddingTop: '100px',
          position: 'relative',
          transition: 'background 0.5s ease',
        },
      }, [
        h(NavBar),
        h('p', {
          style: {
            textAlign: 'center',
            fontFamily: "'Syne', sans-serif",
            fontSize: '14px',
            opacity: 0.3,
            marginTop: '40px',
            color: 'var(--color-text-primary, #2c2c2c)',
          },
        }, 'Click pills to see the liquid-glass sliding animation.'),
      ]),
  }),
}

export const PillStates = {
  render: () => ({
    setup: () => () =>
      h('div', {
        style: {
          padding: '48px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          background: 'var(--color-bg-body, #f0ede8)',
          transition: 'background 0.5s ease',
        },
      }, [
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--color-surface-nav-blur, rgba(249,249,249,0.5))',
            backdropFilter: 'blur(8px)',
            padding: '4px',
            borderRadius: '100px',
            transition: 'background 0.5s ease',
          },
        }, [
          // Active pill
          h('div', {
            style: {
              padding: '8px 16px',
              borderRadius: '100px',
              fontFamily: "var(--font-family-primary, 'Syne', sans-serif)",
              fontWeight: 500,
              fontSize: '16px',
              color: 'var(--color-text-primary, #2c2c2c)',
              background: 'var(--color-surface-nav, #ffffff)',
              boxShadow: '0 0 40px var(--color-shadow-nav, rgba(0,0,0,0.06))',
              transition: 'color 0.5s ease, background 0.5s ease',
            },
          }, 'All'),
          // Default pill
          h('div', {
            style: {
              padding: '8px 16px',
              borderRadius: '100px',
              fontFamily: "var(--font-family-primary, 'Syne', sans-serif)",
              fontWeight: 500,
              fontSize: '16px',
              color: 'var(--color-text-primary, #2c2c2c)',
              transition: 'color 0.5s ease',
            },
          }, 'About'),
          // Hover pill
          h('div', {
            style: {
              padding: '8px 16px',
              borderRadius: '100px',
              fontFamily: "var(--font-family-primary, 'Syne', sans-serif)",
              fontWeight: 500,
              fontSize: '16px',
              color: 'var(--color-primary, #008B8B)',
              transition: 'color 0.5s ease',
            },
          }, 'Work (hover)'),
          // Default pill
          h('div', {
            style: {
              padding: '8px 16px',
              borderRadius: '100px',
              fontFamily: "var(--font-family-primary, 'Syne', sans-serif)",
              fontWeight: 500,
              fontSize: '16px',
              color: 'var(--color-text-primary, #2c2c2c)',
              transition: 'color 0.5s ease',
            },
          }, 'Side Quests'),
        ]),
      ]),
  }),
}
