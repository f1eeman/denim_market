export interface Term {
  term: string
  value: string
}

export interface Block {
  heading: string
  paragraphs?: string[]
  rows?: Term[]
}

export interface InfoPage {
  slug: string
  title: string
  heading: string
  description: string
  lead: string
  blocks: Block[]
}

export interface CategoryProse {
  lead: string
  blocks: Block[]
}

export interface LinkGroup {
  heading: string
  links: { label: string; href: string }[]
}

export const NOINDEX = 'noindex, follow'

export const INFO_PAGES: InfoPage[] = [
  {
    slug: 'delivery',
    title: 'Delivery — Nîmes',
    heading: 'Delivery',
    description:
      'Shipping options, costs and delivery times at Nîmes, with 30 days to return and free returns once per order.',
    lead: 'Orders leave us within one working day. Standard delivery is free over $75.',
    blocks: [
      {
        heading: 'Shipping',
        paragraphs: [
          'Orders placed before 2 pm leave the same working day. Anything later goes out the next one.',
          'Times count working days only. Weekends and public holidays are not counted, and the clock starts when the parcel leaves us.',
        ],
        rows: [
          { term: 'Standard', value: '3–6 working days. $6, free over $75.' },
          { term: 'Express', value: '1–2 working days. $14.' },
          { term: 'Pickup point', value: '3–5 working days. $4.' },
          {
            term: 'International',
            value: '6–12 working days. $22, free over $200.',
          },
        ],
      },
      {
        heading: 'Tracking',
        paragraphs: [
          'A tracking link goes out by email when the parcel leaves the warehouse. It updates once a day, so a quiet day is normal.',
          'If the link has not moved for three working days, write to us with the order number. We chase the carrier, you do not have to.',
        ],
      },
      {
        heading: 'Returns',
        paragraphs: [
          'The return label is in the email that came with your order. Ask for a new one if you cannot find it.',
          'Products bought at a reduced price come back on the same terms as everything else. Altered products do not — an alteration is final.',
        ],
        rows: [
          { term: 'Window', value: '30 days from the day the parcel arrives.' },
          {
            term: 'Condition',
            value: 'Unworn, tags on, in the original packaging.',
          },
          {
            term: 'Return shipping',
            value: 'Free once per order. $6 for each return after that.',
          },
          {
            term: 'Refund',
            value:
              'To the original payment method, within 5 working days of the parcel reaching us.',
          },
        ],
      },
      {
        heading: 'Exchanges',
        paragraphs: [
          'We exchange a product for another size or colour of the same product, once per order. Ask for it in the return request and we hold the new size for seven days.',
          'For a different product, send the first one back and order again. It is quicker than an exchange, and free standard delivery still applies.',
        ],
      },
      {
        heading: 'Faults and wrong products',
        paragraphs: [
          'Send us a photo of the fault within 14 days of delivery. We replace the product if the size is still in stock and refund it if not. Return shipping is on us either way.',
          'A wrong product in the parcel is our mistake. We send the right one straight away and collect the wrong one afterwards, so you are not waiting on us twice.',
        ],
      },
    ],
  },
  {
    slug: 'service',
    title: 'Service — Nîmes',
    heading: 'Service',
    description:
      'Sizing, denim care, repairs and alterations at Nîmes, and how to reach us.',
    lead: 'Which size to take, how to wash denim, what we repair, and how to reach a person.',
    blocks: [
      {
        heading: 'Finding your size',
        paragraphs: [
          'These are body measurements, not the product laid flat. Measure over the underwear you would wear with the product, not over another pair of jeans.',
          'Waist at the narrowest point above the hip bone, hips at the fullest point. Stand up, keep the tape flat, and do not pull it tight.',
          'Rigid denim with no elastic fibre in it relaxes at the waist over the first hours of wear and stays relaxed. Between two sizes, take the smaller one. Denim with stretch moves from the first wear and does not relax the same way — there, take your usual size.',
        ],
        rows: [
          { term: 'XS', value: 'Waist 24 in, hips 34 in' },
          { term: 'S', value: 'Waist 26 in, hips 36 in' },
          { term: 'M', value: 'Waist 28 in, hips 38 in' },
          { term: 'L', value: 'Waist 30 in, hips 40 in' },
          { term: 'XL', value: 'Waist 32 in, hips 42 in' },
        ],
      },
      {
        heading: 'Denim care',
        paragraphs: [
          'Wash denim less than you think. Air it overnight, deal with a mark where it is, and give it a full wash when it needs one rather than on a schedule.',
          'Dark indigo gives up dye in the first few washes. Keep it away from light clothes until the water runs clear. Cotton denim can shrink a little the first time it is washed warm, which is one more reason to wash it cold.',
        ],
        rows: [
          { term: 'Wash', value: 'Cold, inside out, on its own.' },
          { term: 'Detergent', value: 'Mild liquid. No bleach, no softener.' },
          { term: 'Dry', value: 'Flat or on a line, out of the sun.' },
          { term: 'Tumble dryer', value: 'No.' },
          { term: 'Iron', value: 'Warm, inside out, while slightly damp.' },
        ],
      },
      {
        heading: 'Repairs and alterations',
        paragraphs: [
          'Send the product back with the repair form from your order email. Tell us what you want changed and, for a tear, add a photo so we can quote before you post it.',
          'We keep the original thread colour where we can, so a mended seam does not read as new. An altered product cannot be returned, so try it on first and send it for alterations after that.',
        ],
        rows: [
          {
            term: 'Hemming',
            value: 'Free within 30 days of the order. $12 after that.',
          },
          { term: 'Sleeves', value: 'Shortened, $12.' },
          { term: 'Waist', value: 'Taken in, $18.' },
          { term: 'Zip or button', value: 'Replaced, $15.' },
          {
            term: 'Tear or seam',
            value: 'From $20, quoted once we have seen it.',
          },
          {
            term: 'Turnaround',
            value: '5–7 working days, plus shipping both ways.',
          },
        ],
      },
      {
        heading: 'Getting in touch',
        paragraphs: [
          'Write from the address you ordered with and quote the order number. It saves a round of questions and gets you an answer the same day more often than not.',
          'Social links are in the footer of every page.',
        ],
        rows: [
          { term: 'Answer time', value: 'One working day, Monday to Friday.' },
          {
            term: 'Have ready',
            value: 'Order number, size, and a photo if something is wrong.',
          },
          {
            term: 'Repairs and returns',
            value:
              'One request covers both — say so and we will not post the product twice.',
          },
        ],
      },
    ],
  },
]

export const CATEGORY_PROSE: Record<string, CategoryProse> = {
  jeans: {
    lead: 'One cut, cotton denim, sizes XS to XL.',
    blocks: [
      {
        heading: 'The cut',
        paragraphs: [
          'A high rise that sits on the natural waist, five pockets, a single-button fly and belt loops. The leg is cut straight and relaxed from the knee down, so it falls rather than tapers.',
          'Mid blue with an even wash and no distressing. The topstitching is a shade lighter than the cloth, which is the only decoration on the pair.',
        ],
        rows: [
          { term: 'Rise', value: 'High, on the natural waist.' },
          { term: 'Leg', value: 'Straight, relaxed from the knee.' },
          { term: 'Cloth', value: 'Cotton denim, rigid.' },
          { term: 'Wash', value: 'Mid blue, even, no distressing.' },
        ],
      },
      {
        heading: 'Sizing this cut',
        paragraphs: [
          'The cloth is rigid, so it relaxes at the waist over the first hours of wear and stays relaxed. Between two sizes, take the smaller one.',
          'Waist and hip measurements for every size, and how to take them, are on the Service page.',
        ],
      },
      {
        heading: 'What else is in the shop',
        paragraphs: [
          'Jackets are the largest category right now — the Fall 2019 collection is 45 of them. Overalls are a smaller group of three cuts.',
        ],
      },
    ],
  },
  shirts: {
    lead: 'One cut, cotton denim, worn open or buttoned.',
    blocks: [
      {
        heading: 'The cut',
        paragraphs: [
          'A long overshirt in light-wash denim: a soft collar that buttons down, a full button placket, one patch pocket on the chest and a long sleeve that takes a roll to the elbow.',
          'The body is cut loose and finishes below the hip, so it works over a shirt as easily as over a t-shirt. The hem is left raw on purpose and will fray a little further in the first washes, then stop.',
        ],
        rows: [
          { term: 'Fit', value: 'Loose, below the hip.' },
          { term: 'Collar', value: 'Soft, buttons down.' },
          { term: 'Placket', value: 'Full, buttoned.' },
          { term: 'Cloth', value: 'Cotton denim, light wash.' },
          { term: 'Hem', value: 'Raw.' },
        ],
      },
      {
        heading: 'Sizing this cut',
        paragraphs: [
          'The fit is loose by design, so take your usual size unless you want it wider over a layer. Chest and waist measurements are on the Service page.',
        ],
      },
      {
        heading: 'What else is in the shop',
        paragraphs: [
          'Jackets sit closer to the body than this overshirt and there are 45 of them in the current collection. Overalls are cut from the same cloth in three shapes.',
        ],
      },
    ],
  },
}

export const SHOP_LEAD =
  'Four cuts of denim: jeans, shirts, jackets and overalls.'

export const SITE_LINKS: LinkGroup[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'All categories', href: '/shop' },
      { label: 'Jackets — Denim Collection Fall 2019', href: '/catalog' },
      { label: 'Overalls', href: '/shop/overalls' },
      { label: 'Jeans', href: '/shop/jeans' },
      { label: 'Shirts', href: '/shop/shirts' },
      { label: 'Overalls — product page', href: '/product' },
    ],
  },
  {
    heading: 'Pages',
    links: [
      { label: 'Home', href: '/' },
      { label: 'News', href: '/news' },
      { label: 'Delivery', href: '/delivery' },
      { label: 'Service', href: '/service' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
]
