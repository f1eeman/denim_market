import type { ImageMetadata } from 'astro'

import product01 from '@/img/product-01.jpg'
import product02 from '@/img/product-02.jpg'
import product03 from '@/img/product-03.jpg'
import product04 from '@/img/product-04.jpg'
import product05 from '@/img/product-05.jpg'
import product06 from '@/img/product-06.jpg'
import product07 from '@/img/product-07.jpg'
import categoryJeans from '@/img/category-jeans.jpg'
import categoryShirts from '@/img/category-shirts.jpg'
import categoryJackets from '@/img/category-jackets.jpg'
import categoryOveralls from '@/img/category-overalls.jpg'
import newsCover from '@/img/news-cover.jpg'
import productShot1 from '@/img/product-shot-1.jpg'
import productShot2 from '@/img/product-shot-2.jpg'
import productShot3 from '@/img/product-shot-3.jpg'
import productShot4 from '@/img/product-shot-4.jpg'
import productShot5 from '@/img/product-shot-5.jpg'

export interface Tile {
  id: string
  name: string
  price: number
  photo: ImageMetadata
}

export interface Category {
  name: string
  slug: string
  photo: ImageMetadata
  href: string
}

export interface Swatch {
  id: string
  label: string
  color: string
}

export const NAV = [
  { label: 'Woman', href: '/shop' },
  { label: 'Man', href: '/shop' },
  { label: 'New', href: '/shop' },
]

export const FOOTER_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Delivery', href: '/delivery' },
  { label: 'Service', href: '/service' },
  { label: 'Sitemap', href: '/sitemap' },
  { label: 'Contacts', href: '#contacts' },
]

export const SOCIALS = [
  { name: 'Facebook', href: 'https://facebook.com' },
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'Pinterest', href: 'https://pinterest.com' },
  { name: 'Twitter', href: 'https://twitter.com' },
]

export const BESTSELLERS: Tile[] = [
  { id: 'jacket-a', name: 'Jacket', price: 120, photo: product01 },
  { id: 'overalls-a', name: 'Overalls', price: 140, photo: product02 },
  { id: 'jacket-b', name: 'Jacket', price: 90, photo: product03 },
  { id: 'overalls-b', name: 'Overalls', price: 160, photo: product04 },
]

export const RELATED: Tile[] = [
  { id: 'overalls-a', name: 'Overalls', price: 140, photo: product02 },
  { id: 'overalls-c', name: 'Overalls', price: 110, photo: product05 },
  { id: 'jacket-c', name: 'Jacket', price: 70, photo: product06 },
  { id: 'jacket-d', name: 'Jacket', price: 60, photo: product07 },
]

export const CATEGORIES: Category[] = [
  {
    name: 'Jeans',
    slug: 'jeans',
    photo: categoryJeans,
    href: '/shop/jeans',
  },
  {
    name: 'Shirts',
    slug: 'shirts',
    photo: categoryShirts,
    href: '/shop/shirts',
  },
  {
    name: 'Jackets',
    slug: 'jackets',
    photo: categoryJackets,
    href: '/catalog',
  },
  {
    name: 'Overalls',
    slug: 'overalls',
    photo: categoryOveralls,
    href: '/shop/overalls',
  },
]

export const tilesByName = (name: string): Tile[] => {
  const seen = new Set<string>()

  return [...BESTSELLERS, ...RELATED].filter((tile) => {
    if (tile.name !== name || seen.has(tile.id)) return false

    seen.add(tile.id)

    return true
  })
}

export const NEWS = {
  title: 'G-Star Updates Its Sustainable Collection',
  date: 'Feb 12, 2020',
  dateTime: '2020-02-12',
  excerpt:
    'G-Star Raw is pushing the sustainability movement forward with a collection of stretch denim items for spring 2020 which is particularly designed for reuse...',
  lead: 'G-Star Raw is pushing the sustainability movement forward with a collection of stretch denim items for spring 2020 which is particularly designed for reuse.',
  body: [
    'That is the announcement, and we are not going to pad it out. Nîmes does not carry the collection, so anything we added about how it is made or how it wears would be our guess rather than news.',
    'The phrase worth stopping on is the last one: designed for reuse. Reuse is settled when a garment is drawn, not when it is thrown away. A product cut from one fibre, sewn so its seams can be opened again, with fastenings that come off whole, can be taken back to material. One that is glued or fused resists that, however carefully it is sorted afterwards.',
    'Stretch denim makes the problem harder, and the reason is mechanical. The stretch comes from an elastic fibre spun into the cotton yarn itself, twisted through it rather than layered on top, so the two do not come apart the way a lining is pulled out of a jacket. Designing stretch denim for reuse is therefore a question about the yarn, and it is answered before anything is cut.',
    'None of this is visible on the hanger. Two pairs of jeans with the same weight and the same give can be built to come apart or built to stay one piece of mixed fibre, and the care label rarely says which. Until it does, the useful questions stay the old ones: does it fit, will it hold, can it be mended.',
    'The last one we can answer for our own products. We hem, take in and repair what we sell, and the prices are on the Service page. A product that can be mended stays in use longer than one that has to be replaced.',
  ],
  cover: newsCover,
  href: '/news',
}

export const PROMO = {
  eyebrow: 'The quality you deserve',
  title: 'DENIM',
  action: { label: 'Check new collection', href: '/catalog' },
}

export const PRODUCT = {
  id: 'overalls-hero',
  name: 'Overalls',
  price: 160,
  description:
    'Overalls in washed organic cotton denim. Collar, button fly, and adjustable belt at waist. Chest pockets with flap. Long, gently flared sleeves and straight legs with front pockets and back pockets.',
  colors: [
    { id: 'mist', label: 'Mist', color: '#b0c3c7' },
    { id: 'indigo', label: 'Indigo', color: '#3b6392' },
    { id: 'stone', label: 'Stone', color: '#bfc3c8' },
  ] satisfies Swatch[],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  defaultSize: 'S',
  shots: [
    productShot1,
    productShot2,
    productShot3,
    productShot4,
    productShot5,
  ] satisfies ImageMetadata[],
}
