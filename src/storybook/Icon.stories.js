import { h } from 'vue'

/* Inline SVG data URLs — works in all environments without bundler config */
const expandSvg = `data:image/svg+xml,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.25 4.5V9C20.25 9.19891 20.171 9.38968 20.0303 9.53033C19.8897 9.67098 19.6989 9.75 19.5 9.75C19.3011 9.75 19.1103 9.67098 18.9697 9.53033C18.829 9.38968 18.75 9.19891 18.75 9V6.31031L14.0306 11.0306C13.8899 11.1714 13.699 11.2504 13.5 11.2504C13.301 11.2504 13.1101 11.1714 12.9694 11.0306C12.8286 10.8899 12.7496 10.699 12.7496 10.5C12.7496 10.301 12.8286 10.1101 12.9694 9.96937L17.6897 5.25H15C14.8011 5.25 14.6103 5.17098 14.4697 5.03033C14.329 4.88968 14.25 4.69891 14.25 4.5C14.25 4.30109 14.329 4.11032 14.4697 3.96967C14.6103 3.82902 14.8011 3.75 15 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5ZM9.96937 12.9694L5.25 17.6897V15C5.25 14.8011 5.17098 14.6103 5.03033 14.4697C4.88968 14.329 4.69891 14.25 4.5 14.25C4.30109 14.25 4.11032 14.329 3.96967 14.4697C3.82902 14.6103 3.75 14.8011 3.75 15V19.5C3.75 19.6989 3.82902 19.8897 3.96967 20.0303C4.11032 20.171 4.30109 20.25 4.5 20.25H9C9.19891 20.25 9.38968 20.171 9.53033 20.0303C9.67098 19.8897 9.75 19.6989 9.75 19.5C9.75 19.3011 9.67098 19.1103 9.53033 18.9697C9.38968 18.829 9.19891 18.75 9 18.75H6.31031L11.0306 14.0306C11.1714 13.8899 11.2504 13.699 11.2504 13.5C11.2504 13.301 11.1714 13.1101 11.0306 12.9694C10.8899 12.8286 10.699 12.7496 10.5 12.7496C10.301 12.7496 10.1101 12.8286 9.96937 12.9694Z" fill="#2C2C2C"/></svg>')}`

const externalLinkSvg = `data:image/svg+xml,${encodeURIComponent('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 3h6v6" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 3l-8 8" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round"/><path d="M9 5H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-5" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`

const copySvg = `data:image/svg+xml,${encodeURIComponent('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="7" width="10" height="10" rx="2" stroke="#2c2c2c" stroke-width="1.5" stroke-linejoin="round"/><path d="M13 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`

const shrinkSvg = `data:image/svg+xml,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.0306 5.03063L15.3103 9.75001H18C18.1989 9.75001 18.3897 9.82902 18.5303 9.96968C18.671 10.1103 18.75 10.3011 18.75 10.5C18.75 10.6989 18.671 10.8897 18.5303 11.0303C18.3897 11.171 18.1989 11.25 18 11.25H13.5C13.3011 11.25 13.1103 11.171 12.9697 11.0303C12.829 10.8897 12.75 10.6989 12.75 10.5V6.00001C12.75 5.80109 12.829 5.61033 12.9697 5.46968C13.1103 5.32902 13.3011 5.25001 13.5 5.25001C13.6989 5.25001 13.8897 5.32902 14.0303 5.46968C14.171 5.61033 14.25 5.80109 14.25 6.00001V8.68969L18.9694 3.96938C19.1101 3.82865 19.301 3.74959 19.5 3.74959C19.699 3.74959 19.8899 3.82865 20.0306 3.96938C20.1714 4.11011 20.2504 4.30098 20.2504 4.50001C20.2504 4.69903 20.1714 4.8899 20.0306 5.03063ZM10.5 12.75H6C5.80109 12.75 5.61032 12.829 5.46967 12.9697C5.32902 13.1103 5.25 13.3011 5.25 13.5C5.25 13.6989 5.32902 13.8897 5.46967 14.0303C5.61032 14.171 5.80109 14.25 6 14.25H8.68969L3.96937 18.9694C3.82864 19.1101 3.74958 19.301 3.74958 19.5C3.74958 19.699 3.82864 19.8899 3.96937 20.0306C4.1101 20.1714 4.30097 20.2504 4.5 20.2504C4.69902 20.2504 4.88989 20.1714 5.03062 20.0306L9.75 15.3103V18C9.75 18.1989 9.82902 18.3897 9.96967 18.5303C10.1103 18.671 10.3011 18.75 10.5 18.75C10.6989 18.75 10.8897 18.671 11.0303 18.5303C11.171 18.3897 11.25 18.1989 11.25 18V13.5C11.25 13.3011 11.171 13.1103 11.0303 12.9697C10.8897 12.829 10.6989 12.75 10.5 12.75Z" fill="black"/></svg>')}`

const fullScreenSvg = `data:image/svg+xml,${encodeURIComponent('<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7V4a1 1 0 0 1 1-1h3" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 3h3a1 1 0 0 1 1 1v3" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 13v3a1 1 0 0 1-1 1h-3" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 17H4a1 1 0 0 1-1-1v-3" stroke="#2c2c2c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`

export default {
  title: 'Foundation/Icon',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/z8dToxFCYzuNWAEZ3BIIqH/Portfolio---Design-System?node-id=4-33',
    },
  },
  argTypes: {
    size: {
      control: { type: 'range', min: 12, max: 48, step: 4 },
      description: 'Icon size in pixels',
    },
  },
}

const icons = [
  { name: 'Expand', src: expandSvg },
  { name: 'External Link', src: externalLinkSvg },
  { name: 'Copy', src: copySvg },
  { name: 'Shrink', src: shrinkSvg },
  { name: 'Full Screen', src: fullScreenSvg },
]

export const AllIcons = {
  args: { size: 24 },
  render: (args) => ({
    setup: () => () =>
      h('div', {
        style: {
          display: 'flex',
          gap: '32px',
          padding: '24px',
          flexWrap: 'wrap',
        },
      }, icons.map(icon =>
        h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          },
        }, [
          h('div', {
            style: {
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-surface-card, #faf9f7)',
              borderRadius: '16px',
              border: '1px solid var(--color-border-card, rgba(0,0,0,0.08))',
            },
          }, [
            h('img', {
              src: icon.src,
              alt: icon.name,
              style: {
                width: `${args.size}px`,
                height: `${args.size}px`,
                filter: 'var(--filter-action-icon, none)',
              },
            }),
          ]),
          h('span', {
            style: { fontFamily: "'Syne', sans-serif", fontSize: '11px', opacity: 0.5, color: 'var(--color-text-primary, #2c2c2c)' },
          }, icon.name),
        ])
      )),
  }),
}

export const ActionIcon = {
  render: () => ({
    setup: () => () =>
      h('div', { style: { padding: '24px', display: 'flex', gap: '24px' } }, [
        h('div', {
          style: {
            width: '40px',
            height: '40px',
            borderRadius: '100px',
            background: 'var(--color-surface-card-white, #fff)',
            boxShadow: '0 2px 40px var(--color-shadow-action-icon, rgba(0,0,0,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }, [
          h('img', {
            src: expandSvg,
            alt: 'Expand',
            style: { width: '20px', height: '20px', filter: 'var(--filter-action-icon, none)' },
          }),
        ]),
        h('div', {
          style: {
            width: '40px',
            height: '40px',
            borderRadius: '100px',
            background: 'var(--color-surface-card-white, #fff)',
            boxShadow: '0 2px 40px var(--color-shadow-action-icon, rgba(0,0,0,0.1))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }, [
          h('img', {
            src: externalLinkSvg,
            alt: 'External Link',
            style: { width: '20px', height: '20px', filter: 'var(--filter-action-icon, none)' },
          }),
        ]),
      ]),
  }),
}
