/**
 * filterLayouts.js
 *
 * Defines the CSS grid position (and dim state) for every card in each
 * nav-filter state. Keys match the slot keys used in App.js.
 *
 * col / row values are passed directly as gridColumn / gridRow CSS properties.
 * dim: true  → card is de-prioritised (rendered at 30 % opacity).
 * dim absent → card is a priority card (full opacity).
 *
 * Layout grid: 4 columns × 252 px, gap 18 px, auto rows 252 px.
 *
 * Row reference (8 rows, 9 for Side Quests):
 *   col notation  '1/3' = cols 1–2 (left half)
 *                 '3/5' = cols 3–4 (right half)
 *                 '1'|'2'|'3'|'4' = single column
 */

/* ── Helper: 2-column grid uses cols 1–2 instead of 1–4 ────────────── */
const MOBILE_BREAKPOINT = 768

/**
 * Desktop layouts — 4-column grid (252 px fixed columns).
 */
export const LAYOUTS = {

  // ── ALL ──────────────────────────────────────────────────────────────────
  All: {
    about:      { col: '1 / 3', row: '1'      },
    gmail:      { col: '3',     row: '1'      },
    linkedin:   { col: '4',     row: '1'      },
    bulb:       { col: '1',     row: '2'      },
    duolingo:   { col: '2',     row: '2'      },
    plugin:     { col: '3 / 5', row: '2 / 4'  },
    ds:         { col: '1 / 3', row: '3 / 5'  },
    agenticds:  { col: '3',     row: '4 / 6'  },
    laydown:    { col: '4',     row: '4 / 6'  },
    dsquote:    { col: '1 / 3', row: '5'      },
    alexa:      { col: '1 / 3', row: '6 / 8'  },
    uxquote:    { col: '3 / 5', row: '6'      },
    schedule:   { col: '3 / 5', row: '7 / 9'  },
    ssds:       { col: '1 / 3', row: '8 / 10' },
    strava:     { col: '3',     row: '9'      },
    clawinvest: { col: '4',     row: '9'      },
  },

  // ── ABOUT ────────────────────────────────────────────────────────────────
  // Priority: About · Gmail · LinkedIn · UX Quote · DS Quote
  // Remaining pushed down one row, filling the same layout pattern.
  //
  // Row 1: About(c1-2)  Gmail(c3)   LinkedIn(c4)
  // Row 2: UXQuote(c1-2)  DSQuote(c3-4)
  // Row 3: Bulb(c1)  Duolingo(c2)  Plugin(c3-4) ─┐
  // Row 4: DS(c1-2)  Plugin(c3-4)                 │ no gaps
  // Row 5: DS(c1-2)  Alexa(c3-4) ─┐               │
  // Row 6: Schedule(c1-2)  Alexa   │               │
  // Row 7: Schedule  Project(c3-4) │               │
  // Row 8: ClawInvest  Strava  Project             ┘
  About: {
    about:      { col: '1 / 3', row: '1'      },
    gmail:      { col: '3',     row: '1'      },
    linkedin:   { col: '4',     row: '1'      },
    uxquote:    { col: '1 / 3', row: '2'      },
    dsquote:    { col: '3 / 5', row: '2'      },
    bulb:       { col: '1',     row: '3',      dim: true },
    duolingo:   { col: '2',     row: '3',      dim: true },
    plugin:     { col: '3 / 5', row: '3 / 5',  dim: true },
    ds:         { col: '1 / 3', row: '4 / 6',  dim: true },
    agenticds:  { col: '3',     row: '5 / 7',  dim: true },
    laydown:    { col: '4',     row: '5 / 7',  dim: true },
    schedule:   { col: '1 / 3', row: '6 / 8',  dim: true },
    alexa:      { col: '3 / 5', row: '7 / 9',  dim: true },
    ssds:       { col: '1 / 3', row: '8 / 10', dim: true },
    strava:     { col: '3',     row: '10',     dim: true },
    clawinvest: { col: '4',     row: '10',     dim: true },
  },

  // ── WORK ─────────────────────────────────────────────────────────────────
  // Priority: Rayo DS · Rayo Plugin · Rayo Schedule · Rayo Alexa · SS DS
  //
  // Row 1-2: DS(c1-2)  Plugin(c3-4)
  // Row 3-4: Schedule(c1-2)  Alexa(c3-4)
  // Row 5:   About(c1-2)  Project(c3-4) ─┐
  // Row 6:   Gmail(c1) LinkedIn(c2)  Project │ no gaps
  // Row 7:   Bulb(c1) Duolingo(c2)  DSQuote  │
  // Row 8:   UXQuote(c1-2)  ClawInvest  Strava┘
  // Row 1-2: RayoDS(c1-2)  Plugin(c3-4)
  // Row 3-4: Agentic(c1) Lay.Down(c2)  Schedule(c3-4)
  // Row 5-6: Alexa(c1-2)  SS-DS(c3-4)
  Work: {
    ds:         { col: '1 / 3', row: '1 / 3'  },
    plugin:     { col: '3 / 5', row: '1 / 3'  },
    agenticds:  { col: '1',     row: '3 / 5'  },
    laydown:    { col: '2',     row: '3 / 5'  },
    schedule:   { col: '3 / 5', row: '3 / 5'  },
    alexa:      { col: '1 / 3', row: '5 / 7'  },
    ssds:       { col: '3 / 5', row: '5 / 7'  },
    about:      { col: '1 / 3', row: '7',      dim: true },
    dsquote:    { col: '3 / 5', row: '7',      dim: true },
    gmail:      { col: '1',     row: '8',      dim: true },
    linkedin:   { col: '2',     row: '8',      dim: true },
    uxquote:    { col: '3 / 5', row: '8',      dim: true },
    bulb:       { col: '1',     row: '9',      dim: true },
    duolingo:   { col: '2',     row: '9',      dim: true },
    clawinvest: { col: '4',     row: '9',      dim: true },
    strava:     { col: '3',     row: '9',      dim: true },
  },

  // ── SIDE QUESTS ──────────────────────────────────────────────────────────
  // Priority: Bulb · Duolingo · Claw Invest · Strava
  //
  // Row 1: Bulb(c1)  Duolingo(c2)  ClawInvest(c3)  Strava(c4)
  // Row 2: About(c1-2)  Gmail(c3)  LinkedIn(c4)
  // Row 3-4: DS(c1-2)  Plugin(c3-4)
  // Row 5: UXQuote(c1-2)  DSQuote(c3-4)
  // Row 6-7: Schedule(c1-2)  Alexa(c3-4)
  // Row 8-9: Project(c3-4)  [c1-2 naturally empty — these 4 cards moved up]
  'Side Quests': {
    bulb:       { col: '1',     row: '1'       },
    duolingo:   { col: '2',     row: '1'       },
    clawinvest: { col: '4',     row: '1'       },
    strava:     { col: '3',     row: '1'       },
    about:      { col: '1 / 3', row: '2',      dim: true },
    gmail:      { col: '3',     row: '2',      dim: true },
    linkedin:   { col: '4',     row: '2',      dim: true },
    ds:         { col: '1 / 3', row: '3 / 5',  dim: true },
    plugin:     { col: '3 / 5', row: '3 / 5',  dim: true },
    agenticds:  { col: '3',     row: '5 / 7',  dim: true },
    laydown:    { col: '4',     row: '5 / 7',  dim: true },
    dsquote:    { col: '1 / 3', row: '5',      dim: true },
    uxquote:    { col: '1 / 3', row: '6',      dim: true },
    schedule:   { col: '1 / 3', row: '7 / 9',  dim: true },
    alexa:      { col: '3 / 5', row: '7 / 9',  dim: true },
    ssds:       { col: '3 / 5', row: '9 / 11', dim: true },
  },
}


/**
 * Mobile layouts — 2-column fluid grid (1fr columns).
 * Card order follows the staggered animation-delay reading order.
 * '1 / 3' spans both columns in a 2-col grid.
 */
export const MOBILE_LAYOUTS = {

  // ── ALL (mobile) ────────────────────────────────────────────────────────
  All: {
    about:      { col: '1 / 3', row: '1'      },
    gmail:      { col: '1',     row: '2'      },
    linkedin:   { col: '2',     row: '2'      },
    plugin:     { col: '1 / 3', row: '3 / 5'  },
    ds:         { col: '1 / 3', row: '5 / 7'  },
    dsquote:    { col: '1 / 3', row: '7'      },
    agenticds:  { col: '1',     row: '8 / 10' },
    laydown:    { col: '2',     row: '8 / 10' },
    uxquote:    { col: '1 / 3', row: '10'     },
    alexa:      { col: '1 / 3', row: '11 / 13'},
    schedule:   { col: '1 / 3', row: '13 / 15'},
    ssds:       { col: '1 / 3', row: '15 / 17'},
    bulb:       { col: '1',     row: '17'     },
    duolingo:   { col: '2',     row: '17'     },
    clawinvest: { col: '2',     row: '18'     },
    strava:     { col: '1',     row: '18'     },
  },

  // ── ABOUT (mobile) ──────────────────────────────────────────────────────
  About: {
    about:      { col: '1 / 3', row: '1'      },
    gmail:      { col: '1',     row: '2'      },
    linkedin:   { col: '2',     row: '2'      },
    uxquote:    { col: '1 / 3', row: '3'      },
    dsquote:    { col: '1 / 3', row: '4'      },
    plugin:     { col: '1 / 3', row: '5 / 7',  dim: true },
    ds:         { col: '1 / 3', row: '7 / 9',  dim: true },
    agenticds:  { col: '1',     row: '9 / 11', dim: true },
    laydown:    { col: '2',     row: '9 / 11', dim: true },
    alexa:      { col: '1 / 3', row: '11 / 13',dim: true },
    schedule:   { col: '1 / 3', row: '13 / 15',dim: true },
    ssds:       { col: '1 / 3', row: '15 / 17',dim: true },
    bulb:       { col: '1',     row: '17',     dim: true },
    duolingo:   { col: '2',     row: '17',     dim: true },
    clawinvest: { col: '2',     row: '18',     dim: true },
    strava:     { col: '1',     row: '18',     dim: true },
  },

  // ── WORK (mobile) ───────────────────────────────────────────────────────
  // RayoDS, RayoPlugin, Agentic+Lay.Down, Schedule, Alexa, SS-DS
  Work: {
    ds:         { col: '1 / 3', row: '1 / 3'  },
    plugin:     { col: '1 / 3', row: '3 / 5'  },
    agenticds:  { col: '1',     row: '5 / 7'  },
    laydown:    { col: '2',     row: '5 / 7'  },
    schedule:   { col: '1 / 3', row: '7 / 9'  },
    alexa:      { col: '1 / 3', row: '9 / 11' },
    ssds:       { col: '1 / 3', row: '11 / 13'},
    about:      { col: '1 / 3', row: '13',     dim: true },
    gmail:      { col: '1',     row: '14',     dim: true },
    linkedin:   { col: '2',     row: '14',     dim: true },
    uxquote:    { col: '1 / 3', row: '15',     dim: true },
    dsquote:    { col: '1 / 3', row: '16',     dim: true },
    bulb:       { col: '1',     row: '17',     dim: true },
    duolingo:   { col: '2',     row: '17',     dim: true },
    clawinvest: { col: '2',     row: '18',     dim: true },
    strava:     { col: '1',     row: '18',     dim: true },
  },

  // ── SIDE QUESTS (mobile) ────────────────────────────────────────────────
  'Side Quests': {
    bulb:       { col: '1',     row: '1'       },
    duolingo:   { col: '2',     row: '1'       },
    clawinvest: { col: '2',     row: '2'       },
    strava:     { col: '1',     row: '2'       },
    about:      { col: '1 / 3', row: '3',      dim: true },
    gmail:      { col: '1',     row: '4',      dim: true },
    linkedin:   { col: '2',     row: '4',      dim: true },
    plugin:     { col: '1 / 3', row: '5 / 7',  dim: true },
    ds:         { col: '1 / 3', row: '7 / 9',  dim: true },
    agenticds:  { col: '1',     row: '9 / 11', dim: true },
    laydown:    { col: '2',     row: '9 / 11', dim: true },
    dsquote:    { col: '1 / 3', row: '11',     dim: true },
    uxquote:    { col: '1 / 3', row: '12',     dim: true },
    alexa:      { col: '1 / 3', row: '13 / 15',dim: true },
    schedule:   { col: '1 / 3', row: '15 / 17',dim: true },
    ssds:       { col: '1 / 3', row: '17 / 19',dim: true },
  },
}

export { MOBILE_BREAKPOINT }
