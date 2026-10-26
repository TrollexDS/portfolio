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
  // Row 2-3   Thumbnails(c1)  Layer Lint(c2)  (tall pair)   Design Lab(c3-4)
  // Row 4-5   AI quote(c1-2, r4)  Agentic(c3) + Rayo DS(c4) (r4-5, tall pair)
  // Row 5-6   Schedule(c1-2)  DS quote(c3-4, r6)
  // Row 7-8   UX quote(c1-2, r7)  Voice UX(c3-4)
  // Row 8-9   Simplestream(c1-2)  Strava(c3, r9)  Duolingo(c4, r9)
  All: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '3',        row: '1' },
    linkedin:   { col: '4',        row: '1' },
    plugin:     { col: '1',        row: '2 / 4' },
    layerlint:  { col: '2',        row: '2 / 4' },
    designlab:  { col: '3 / 5',    row: '2 / 4' },
    aiquote:    { col: '1 / 3',    row: '4' },
    agenticds:  { col: '3',        row: '4 / 6' },
    ds:         { col: '4',        row: '4 / 6' },
    schedule:   { col: '1 / 3',    row: '5 / 7' },
    dsquote:    { col: '3 / 5',    row: '6' },
    uxquote:    { col: '1 / 3',    row: '7' },
    alexa:      { col: '3 / 5',    row: '7 / 9' },
    ssds:       { col: '1 / 3',    row: '8 / 10' },
    strava:     { col: '3',        row: '9' },
    duolingo:   { col: '4',        row: '9' },
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
    designlab:  { col: '1 / 3',   row: '4 / 6',  dim: true },
    plugin:     { col: '1',       row: '8 / 10',  dim: true },
    ds:         { col: '4',       row: '4 / 6',  dim: true },
    agenticds:  { col: '3',       row: '4 / 6',  dim: true },
    layerlint:  { col: '2',       row: '8 / 10',  dim: true },
    schedule:   { col: '1 / 3',   row: '6 / 8',  dim: true },
    alexa:      { col: '3 / 5',   row: '6 / 8',  dim: true },
    ssds:       { col: '3 / 5',   row: '8 / 10',  dim: true },
  },

  // ── WORK ─────────────────────────────────────────────────────────────────
  // Client work. Rayo DS takes a 2x2 here (its tall partner, Agentic, is a
  // side quest); everywhere else it is the tall card.
  Work: {
    designlab:  { col: '1 / 3',    row: '1 / 3' },
    ds:         { col: '3 / 5',    row: '1 / 3' },
    schedule:   { col: '1 / 3',    row: '3 / 5' },
    alexa:      { col: '3 / 5',    row: '3 / 5' },
    ssds:       { col: '1 / 3',    row: '5 / 7' },
    plugin:     { col: '3',        row: '5 / 7',  dim: true },
    layerlint:  { col: '4',        row: '5 / 7',  dim: true },
    agenticds:  { col: '1',        row: '7 / 9',  dim: true },
    about:      { col: '2 / 4',    row: '7',  dim: true },
    gmail:      { col: '4',        row: '7',  dim: true },
    uxquote:    { col: '2 / 4',    row: '8',  dim: true },
    linkedin:   { col: '4',        row: '8',  dim: true },
    aiquote:    { col: '1 / 3',    row: '9',  dim: true },
    dsquote:    { col: '3 / 5',    row: '9',  dim: true },
    strava:     { col: '1',        row: '10',  dim: true },
    duolingo:   { col: '2',        row: '10',  dim: true },
  },

  // ── SIDE QUESTS ──────────────────────────────────────────────────────────
  // Own projects: Rayo Assets Plugin, Layer Lint, Agentic DS (tall, c1-3),
  // Strava over Duolingo (c4).
  'Side Quests': {
    plugin:     { col: '1',        row: '1 / 3' },
    layerlint:  { col: '2',        row: '1 / 3' },
    agenticds:  { col: '3',        row: '1 / 3' },
    strava:     { col: '4',        row: '1' },
    duolingo:   { col: '4',        row: '2' },
    about:      { col: '1 / 3',    row: '3',  dim: true },
    uxquote:    { col: '3 / 5',    row: '3',  dim: true },
    designlab:  { col: '1 / 3',    row: '4 / 6',  dim: true },
    schedule:   { col: '3 / 5',    row: '4 / 6',  dim: true },
    alexa:      { col: '1 / 3',    row: '6 / 8',  dim: true },
    ssds:       { col: '3 / 5',    row: '6 / 8',  dim: true },
    ds:         { col: '1',        row: '8 / 10',  dim: true },
    aiquote:    { col: '2 / 4',    row: '8',  dim: true },
    gmail:      { col: '4',        row: '8',  dim: true },
    dsquote:    { col: '2 / 4',    row: '9',  dim: true },
    linkedin:   { col: '4',        row: '9',  dim: true },
  },
}

/** Mobile — 2-column fluid grid. '1 / 3' spans both columns. */
export const MOBILE_LAYOUTS = {

  All: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '1',        row: '2' },
    linkedin:   { col: '2',        row: '2' },
    designlab:  { col: '1 / 3',    row: '3 / 5' },
    plugin:     { col: '1',        row: '5 / 7' },
    layerlint:  { col: '2',        row: '5 / 7' },
    aiquote:    { col: '1 / 3',    row: '7' },
    agenticds:  { col: '1',        row: '8 / 10' },
    ds:         { col: '2',        row: '8 / 10' },
    schedule:   { col: '1 / 3',    row: '10 / 12' },
    dsquote:    { col: '1 / 3',    row: '12' },
    uxquote:    { col: '1 / 3',    row: '13' },
    alexa:      { col: '1 / 3',    row: '14 / 16' },
    ssds:       { col: '1 / 3',    row: '16 / 18' },
    strava:     { col: '1',        row: '18' },
    duolingo:   { col: '2',        row: '18' },
  },

  About: {
    about:      { col: '1 / 3',    row: '1' },
    gmail:      { col: '1',        row: '2' },
    linkedin:   { col: '2',        row: '2' },
    uxquote:    { col: '1 / 3',    row: '3' },
    dsquote:    { col: '1 / 3',    row: '4' },
    aiquote:    { col: '1 / 3',    row: '5' },
    designlab:  { col: '1 / 3',    row: '6 / 8',  dim: true },
    schedule:   { col: '1 / 3',   row: '12 / 14',  dim: true },
    plugin:     { col: '1',         row: '8 / 10',  dim: true },
    ds:         { col: '2',       row: '10 / 12',  dim: true },
    agenticds:  { col: '1',       row: '10 / 12',  dim: true },
    layerlint:  { col: '2',         row: '8 / 10',  dim: true },
    alexa:      { col: '1 / 3',   row: '14 / 16',  dim: true },
    ssds:       { col: '1 / 3',   row: '16 / 18',  dim: true },
    strava:     { col: '1',       row: '18',  dim: true },
    duolingo:   { col: '2',       row: '18',  dim: true },
  },

  Work: {
    designlab:  { col: '1 / 3',    row: '1 / 3' },
    ds:         { col: '1 / 3',    row: '3 / 5' },
    schedule:   { col: '1 / 3',    row: '5 / 7' },
    alexa:      { col: '1 / 3',    row: '7 / 9' },
    ssds:       { col: '1 / 3',    row: '9 / 11' },
    plugin:     { col: '1',        row: '11 / 13',  dim: true },
    layerlint:  { col: '2',        row: '11 / 13',  dim: true },
    agenticds:  { col: '1',        row: '13 / 15',  dim: true },
    gmail:      { col: '2',        row: '13',  dim: true },
    linkedin:   { col: '2',        row: '14',  dim: true },
    about:      { col: '1 / 3',    row: '15',  dim: true },
    aiquote:    { col: '1 / 3',    row: '16',  dim: true },
    uxquote:    { col: '1 / 3',    row: '17',  dim: true },
    dsquote:    { col: '1 / 3',    row: '18',  dim: true },
    strava:     { col: '1',        row: '19',  dim: true },
    duolingo:   { col: '2',        row: '19',  dim: true },
  },

  'Side Quests': {
    plugin:     { col: '1',        row: '1 / 3' },
    layerlint:  { col: '2',        row: '1 / 3' },
    agenticds:  { col: '1',        row: '3 / 5' },
    strava:     { col: '2',        row: '3' },
    duolingo:   { col: '2',        row: '4' },
    about:      { col: '1 / 3',    row: '5',  dim: true },
    aiquote:    { col: '1 / 3',    row: '6',  dim: true },
    designlab:  { col: '1 / 3',    row: '7 / 9',  dim: true },
    ds:         { col: '1',        row: '9 / 11',  dim: true },
    gmail:      { col: '2',        row: '9',  dim: true },
    linkedin:   { col: '2',        row: '10',  dim: true },
    schedule:   { col: '1 / 3',    row: '11 / 13',  dim: true },
    alexa:      { col: '1 / 3',    row: '13 / 15',  dim: true },
    ssds:       { col: '1 / 3',    row: '15 / 17',  dim: true },
    uxquote:    { col: '1 / 3',    row: '17',  dim: true },
    dsquote:    { col: '1 / 3',    row: '18',  dim: true },
  },
}

export { MOBILE_BREAKPOINT }
