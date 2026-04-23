import { h } from 'vue'
import './storybook-cards.css'
import BentoCard from '../components/BentoCard.js'

export default {
  title: 'Foundation/BentoCard',
  component: BentoCard,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/z8dToxFCYzuNWAEZ3BIIqH/Portfolio---Design-System?node-id=5-45',
    },
  },
  argTypes: {
    dark: {
      control: 'boolean',
      description: 'Dark card variant (used for case study cards)',
    },
    tooltip: {
      control: 'text',
      description: 'Tooltip text shown on hover',
    },
  },
}

const labelStyle = {
  fontFamily: "'Syne', sans-serif",
  fontSize: '11px',
  opacity: 0.5,
  marginTop: '8px',
  display: 'block',
  textAlign: 'center',
  color: 'var(--color-text-primary, #2c2c2c)',
}

const placeholderStyle = (text, light) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  fontFamily: "'Syne', sans-serif",
  fontSize: '14px',
  opacity: 0.4,
  color: light ? 'rgba(255,255,255,0.4)' : 'var(--color-text-primary, #2c2c2c)',
})

export const Default = {
  args: {
    dark: false,
    tooltip: 'Click to expand',
  },
  render: (args) => ({
    components: { BentoCard },
    setup: () => () =>
      h('div', { style: { padding: '48px', background: 'var(--color-bg-body, #f0ede8)' } }, [
        h(BentoCard, {
          dark: args.dark,
          tooltip: args.tooltip,
        }, {
          default: () => h('div', { style: placeholderStyle('252 × 252') }, '252 × 252'),
        }),
      ]),
  }),
}

export const DarkVariant = {
  render: () => ({
    components: { BentoCard },
    setup: () => () =>
      h('div', { style: { padding: '48px', background: 'var(--color-bg-body, #f0ede8)' } }, [
        h(BentoCard, {
          dark: true,
          tooltip: 'View case study',
        }, {
          default: () => h('div', { style: placeholderStyle('Dark Variant', true) }, 'Dark Variant'),
        }),
      ]),
  }),
}

export const States = {
  render: () => ({
    setup: () => () =>
      h('div', { style: { padding: '48px', background: 'var(--color-bg-body, #f0ede8)' } }, [
        h('div', { style: { display: 'flex', gap: '24px' } }, [

          /* ── Rest ── */
          h('div', {}, [
            h('div', {
              class: 'bento-card',
              style: { pointerEvents: 'none' },
            }, [
              h('div', { style: placeholderStyle('Rest') }, 'Rest'),
            ]),
            h('span', { style: labelStyle }, 'Rest'),
          ]),

          /* ── Hover (simulated) ── */
          h('div', {}, [
            h('div', {
              class: 'bento-card',
              style: {
                pointerEvents: 'none',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 40px var(--color-shadow-card-hover, rgba(0,0,0,0.08)), 0 4px 12px var(--color-shadow-card-hover-2, rgba(0,0,0,0.04)), inset 0 1px 0 var(--color-card-inset-top, rgba(255,255,255,0.9)), inset 0 -1px 0 var(--color-card-inset-bottom, rgba(0,0,0,0.04))',
              },
            }, [
              h('div', { style: placeholderStyle('Hover') }, 'Hover'),
            ]),
            h('span', { style: labelStyle }, 'Hover'),
          ]),

          /* ── Pressed ── */
          h('div', {}, [
            h('div', {
              class: 'bento-card',
              style: {
                pointerEvents: 'none',
                transform: 'scale(0.97)',
              },
            }, [
              h('div', { style: placeholderStyle('Pressed') }, 'Pressed'),
            ]),
            h('span', { style: labelStyle }, 'Pressed'),
          ]),

        ]),
      ]),
  }),
}

export const MobileGrid = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
    chromatic: { viewports: [375] },
  },
  render: () => ({
    components: { BentoCard },
    setup: () => () =>
      h('div', {
        style: {
          padding: '24px',
          background: 'var(--color-bg-body, #f0ede8)',
          width: '375px',
        },
      }, [
        h('p', {
          style: {
            fontFamily: "'Syne', sans-serif",
            fontSize: '13px',
            opacity: 0.4,
            marginBottom: '16px',
            color: 'var(--color-text-primary, #2c2c2c)',
          },
        }, 'Mobile 2-column grid — fluid cards with 18px gap'),
        h('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '18px',
          },
        }, [
          /* 4 fluid cards */
          ...[1, 2, 3, 4].map(i =>
            h(BentoCard, {
              dark: i === 2,
              tooltip: i === 2 ? 'View case study' : 'Click to expand',
            }, {
              default: () => h('div', {
                style: {
                  ...placeholderStyle(`Card ${i}`, i === 2),
                  aspectRatio: '1 / 1',
                },
              }, `Card ${i}`),
            })
          ),
        ]),
      ]),
  }),
}

export const ActionLabelVariant = {
  render: () => ({
    components: { BentoCard },
    setup: () => () =>
      h('div', { style: { padding: '48px', background: 'var(--color-bg-body, #f0ede8)', display: 'flex', gap: '24px' } }, [
        /* Standard icon action */
        h('div', {}, [
          h(BentoCard, {
            dark: false,
            tooltip: 'Click to expand',
          }, {
            default: () => h('div', { style: placeholderStyle('Icon action') }, 'Icon action'),
          }),
          h('span', { style: labelStyle }, 'Icon (default)'),
        ]),

        /* Text label action */
        h('div', {}, [
          h(BentoCard, {
            dark: true,
            actionLabel: 'Coming soon',
            tooltip: 'Currently in development',
          }, {
            default: () => h('div', { style: placeholderStyle('Label action', true) }, 'Label action'),
          }),
          h('span', { style: labelStyle }, 'Text label'),
        ]),
      ]),
  }),
}
