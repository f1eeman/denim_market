import type { ImageMetadata } from 'astro'

import catalog01 from '@/img/catalog-01.jpg'
import catalog02 from '@/img/catalog-02.jpg'
import catalog03 from '@/img/catalog-03.jpg'
import catalog04 from '@/img/catalog-04.jpg'
import catalog05 from '@/img/catalog-05.jpg'
import catalog06 from '@/img/catalog-06.jpg'
import catalog07 from '@/img/catalog-07.jpg'
import catalog08 from '@/img/catalog-08.jpg'

export interface CatalogItem {
  id: string
  name: string
  price: number
  photo: ImageMetadata
}

export interface PriceBand {
  id: string
  label: string
  min: number
  max: number | null
}

const PHOTOS = [
  catalog01,
  catalog02,
  catalog03,
  catalog04,
  catalog05,
  catalog06,
  catalog07,
  catalog08,
]

const MEASURED_PRICES = [40, 70, 60, 50, 40, 110, 35, 85]

const PRICE_STEP = 5

export const PAGE_SIZE = PHOTOS.length

export const TOTAL = 45

const cycle = <Item>(items: readonly Item[], index: number): Item => {
  const value = items[index % items.length]

  if (value === undefined) throw new Error('нечего повторять')

  return value
}

const pad = (value: number): string => String(value).padStart(2, '0')

export const CATALOG: CatalogItem[] = Array.from(
  { length: TOTAL },
  (_, index) => ({
    id: `jacket-${pad(index + 1)}`,
    name: 'Jacket',
    price:
      cycle(MEASURED_PRICES, index) +
      Math.trunc(index / PAGE_SIZE) * PRICE_STEP,
    photo: cycle(PHOTOS, index),
  }),
)

export const PRICE_BANDS: PriceBand[] = [
  { id: 'all', label: 'All prices', min: 0, max: null },
  { id: 'under-50', label: 'Under $50', min: 0, max: 49 },
  { id: '50-100', label: '$50 – $100', min: 50, max: 100 },
  { id: 'over-100', label: '$100 and up', min: 101, max: null },
]

export const BREADCRUMBS = [
  { label: 'All categories', href: '/shop' },
  { label: 'Woman', href: null },
  { label: 'Jackets', href: null },
]

export const COLLECTION_TITLE = 'Denim Collection Fall 2019'
