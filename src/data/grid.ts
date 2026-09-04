export const TILE_SIZES = [
  '(width >= 1366px) 270px',
  '(width >= 1016px) calc((85.652vw - 90px) / 4)',
  '(width >= 665px) calc((85.652vw - 60px) / 3)',
  'calc((85.652vw - 30px) / 2)',
].join(', ')

export const CATALOG_SIZES = [
  '(width >= 1366px) 243px',
  '(width >= 1016px) calc((85.652vw - 198px) / 4)',
  '(width >= 665px) calc((85.652vw - 60px) / 3)',
  'calc((85.652vw - 30px) / 2)',
].join(', ')

export const TILE_RATIO = '270 / 349'

export const CATALOG_RATIO = '243 / 270'

export const FIGURE_SIZES = 'min(400px, 85.652vw)'
