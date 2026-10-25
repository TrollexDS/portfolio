/**
 * filterLayouts.js
 *
 * Grid position (and dim state) for every card in each nav-filter state.
 * Keys match the slot keys in App.js — every key in CARD_ENTRIES must appear
 * in all eight maps below or the card renders with no grid position.
 *
 * col / row are passed straight through as gridColumn / gridRow.
 * dim: true → de-prioritised (30 % opacity).
 *
 * Layout grid: 4 columns x 252 px, gap 18 px, auto rows 252 px.
 *   '1 / 3' = cols 1-2   '3 / 5' = cols 3-4   '1'|'2'|'3'|'4' = single column
 */

const MOBILE_BREAKPOINT = 768

/** Desktop — 4-column grid. */
export const LAYOUTS = {

  // ── ALL ──────────────────────────────────────────────────────────────────
  // Row 1     About(c1-2)  Gmail  LinkedIn
  // Row 2     Strava  Duolingo  Design Lab(c3-4, r2-3)
  // Row 3-4   Plugin(c1)  Layer Lint(c2)  (r3-4)   Design Lab / AI principle(c3-4, r4)
  // Row 5-7   UXQuote(c1-2, r5)  Schedule(c3-4, r5-6)  Agentic(c1-2, r6-7)
  // Row 7     DSQuote(c3-4)
  // Row 8-9   Voice UX(c1-2)  Rayo DS(c3-4)
  // Row 10-11 Simplestream(c1-2)
  All: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '3',        row: '1' },
    linkedin:   { col: '4',        row: '1' },
    strava:     { col: '1',        row: '2' },
    duolingo:   { col: '2',        row: '2' },
    designlab:  { col: '3 / 5',    row: '2 / 4' },
    schedule:   { col: '3 / 5',     row: '5 / 7' },
    aiquote:    { col: '3 / 5',    row: '4' },
    uxquote:    { col: '1 / 3',    row: '5' },
    agenticds:  { col: '1 / 3',    row: '6 / 8' },
    layerlint:  { col: '2',         row: '3 / 5' },
    plugin:     { col: '1',         row: '3 / 5' },
    dsquote:    { col: '3 / 5',    row: '7' },
    alexa:      { col: '1 / 3',    row: '8 / 10' },
    ds:         { col: '3 / 5',    row: '8 / 10' },
    ssds:       { col: '1 / 3',    row: '10 / 12' },
  },

  // ── ABOUT ────────────────────────────────────────────────────────────────
  About: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '3',        row: '1' },
    linkedin:   { col: '4',        row: '1' },
    uxquote:    { col: '1 / 3',    row: '2' },
    dsquote:    { col: '3 / 5',    row: '2' },
    aiquote:    { col: '1 / 3',    row: '3' },
    strava:     { col: '3',        row: '3',  dim: true },
    duolingo:   { col: '4',        row: '3',  dim: true },
    designlab:  { col: '1 / 3',    row: '4 / 6',  dim: true },
    plugin:     { col: '1',         row: '8 / 10',  dim: true },
    ds:         { col: '1 / 3',    row: '6 / 8',  dim: true },
    agenticds:  { col: '3 / 5',    row: '4 / 6',  dim: true },
    layerlint:  { col: '2',         row: '8 / 10',  dim: true },
    schedule:   { col: '3 / 5',     row: '6 / 8',  dim: true },
    alexa:      { col: '3 / 5',    row: '8 / 10',  dim: true },
    ssds:       { col: '1 / 3',    row: '10 / 12',  dim: true },
  },

  // ── WORK ─────────────────────────────────────────────────────────────────
  Work: {
    designlab:  { col: '1 / 3',    row: '1 / 3' },
    ds:         { col: '3 / 5',    row: '1 / 3' },
    plugin:     { col: '1',         row: '5 / 7' },
    agenticds:  { col: '1 / 3',    row: '3 / 5' },
    layerlint:  { col: '2',         row: '5 / 7' },
    schedule:   { col: '3 / 5',     row: '3 / 5' },
    alexa:      { col: '3 / 5',    row: '5 / 7' },
    ssds:       { col: '1 / 3',    row: '7 / 9' },
    about:      { col: '3 / 5',    row: '7',  dim: true },
    dsquote:    { col: '3 / 5',    row: '8',  dim: true },
    uxquote:    { col: '1 / 3',    row: '9',  dim: true },
    gmail:      { col: '3',        row: '9',  dim: true },
    linkedin:   { col: '4',        row: '9',  dim: true },
    aiquote:    { col: '1 / 3',    row: '10',  dim: true },
    strava:     { col: '3',        row: '10',  dim: true },
    duolingo:   { col: '4',        row: '10',  dim: true },
  },

  // ── SIDE QUESTS ──────────────────────────────────────────────────────────
  'Side Quests': {
    strava:     { col: '1',        row: '1' },
    duolingo:   { col: '2',        row: '1' },
    about:      { col: '1 / 3',    row: '2',  dim: true },
    gmail:      { col: '3',        row: '2',  dim: true },
    linkedin:   { col: '4',        row: '2',  dim: true },
    designlab:  { col: '1 / 3',    row: '3 / 5',  dim: true },
    plugin:     { col: '3',         row: '7 / 9',  dim: true },
    dsquote:    { col: '1 / 3',    row: '5',  dim: true },
    agenticds:  { col: '3 / 5',    row: '3 / 5',  dim: true },
    layerlint:  { col: '4',         row: '7 / 9',  dim: true },
    uxquote:    { col: '1 / 3',    row: '6',  dim: true },
    aiquote:    { col: '1 / 3',    row: '7',  dim: true },
    schedule:   { col: '3 / 5',     row: '5 / 7',  dim: true },
    alexa:      { col: '1 / 3',    row: '8 / 10',  dim: true },
    ds:         { col: '3 / 5',    row: '9 / 11',  dim: true },
    ssds:       { col: '1 / 3',    row: '10 / 12',  dim: true },
  },
}

/** Mobile — 2-column fluid grid. '1 / 3' spans both columns. */
export const MOBILE_LAYOUTS = {

  All: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '1',        row: '2' },
    linkedin:   { col: '2',        row: '2' },
    strava:     { col: '1',        row: '3' },
    duolingo:   { col: '2',        row: '3' },
    designlab:  { col: '1 / 3',    row: '4 / 6' },
    schedule:   { col: '1 / 3',     row: '10 / 12' },
    aiquote:    { col: '1 / 3',    row: '8' },
    uxquote:    { col: '1 / 3',    row: '9' },
    agenticds:  { col: '1 / 3',    row: '12 / 14' },
    layerlint:  { col: '2',         row: '6 / 8' },
    plugin:     { col: '1',         row: '6 / 8' },
    dsquote:    { col: '1 / 3',    row: '14' },
    alexa:      { col: '1 / 3',    row: '15 / 17' },
    ds:         { col: '1 / 3',    row: '17 / 19' },
    ssds:       { col: '1 / 3',    row: '19 / 21' },
  },

  About: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '1',        row: '2' },
    linkedin:   { col: '2',        row: '2' },
    uxquote:    { col: '1 / 3',    row: '3' },
    dsquote:    { col: '1 / 3',    row: '4' },
    aiquote:    { col: '1 / 3',    row: '5' },
    designlab:  { col: '1 / 3',    row: '6 / 8',  dim: true },
    schedule:   { col: '1 / 3',     row: '14 / 16',  dim: true },
    plugin:     { col: '1',         row: '8 / 10',  dim: true },
    ds:         { col: '1 / 3',    row: '12 / 14',  dim: true },
    agenticds:  { col: '1 / 3',    row: '10 / 12',  dim: true },
    layerlint:  { col: '2',         row: '8 / 10',  dim: true },
    alexa:      { col: '1 / 3',    row: '16 / 18',  dim: true },
    ssds:       { col: '1 / 3',    row: '18 / 20',  dim: true },
    strava:     { col: '1',        row: '20',  dim: true },
    duolingo:   { col: '2',        row: '20',  dim: true },
  },

  Work: {
    designlab:  { col: '1 / 3',    row: '1 / 3' },
    ds:         { col: '1 / 3',    row: '3 / 5' },
    plugin:     { col: '1',         row: '9 / 11' },
    agenticds:  { col: '1 / 3',    row: '5 / 7' },
    layerlint:  { col: '2',         row: '9 / 11' },
    schedule:   { col: '1 / 3',     row: '7 / 9' },
    alexa:      { col: '1 / 3',    row: '11 / 13' },
    ssds:       { col: '1 / 3',    row: '13 / 15' },
    about:      { col: '1 / 3',    row: '15',  dim: true },
    gmail:      { col: '1',        row: '16',  dim: true },
    linkedin:   { col: '2',        row: '16',  dim: true },
    aiquote:    { col: '1 / 3',    row: '17',  dim: true },
    uxquote:    { col: '1 / 3',    row: '18',  dim: true },
    dsquote:    { col: '1 / 3',    row: '19',  dim: true },
    strava:     { col: '1',        row: '20',  dim: true },
    duolingo:   { col: '2',        row: '20',  dim: true },
  },

  'Side Quests': {
    strava:     { col: '1',        row: '1' },
    duolingo:   { col: '2',        row: '1' },
    about:      { col: '1 / 3',    row: '3',  dim: true },
    gmail:      { col: '1',        row: '4',  dim: true },
    linkedin:   { col: '2',        row: '4',  dim: true },
    designlab:  { col: '1 / 3',    row: '5 / 7',  dim: true },
    schedule:   { col: '1 / 3',     row: '13 / 15',  dim: true },
    plugin:     { col: '1',         row: '7 / 9',  dim: true },
    ds:         { col: '1 / 3',    row: '11 / 13',  dim: true },
    agenticds:  { col: '1 / 3',    row: '9 / 11',  dim: true },
    layerlint:  { col: '2',         row: '7 / 9',  dim: true },
    aiquote:    { col: '1 / 3',    row: '15',  dim: true },
    dsquote:    { col: '1 / 3',    row: '16',  dim: true },
    uxquote:    { col: '1 / 3',    row: '17',  dim: true },
    alexa:      { col: '1 / 3',    row: '18 / 20',  dim: true },
    ssds:       { col: '1 / 3',    row: '20 / 22',  dim: true },
  },
}

export { MOBILE_BREAKPOINT }
