const aliases = {
  'bread-1': 'salt-bread',
  'bread-7': 'cinnamon-roll',
  'sandwich-5': 'bulgogi-sandwich',
  'cake-1': 'strawberry-cream-cake',
  'strawberry-shortcake': 'strawberry-cream-cake',
  'cake-3': 'chocolate-cake',
  'cake-4': 'matcha-cake',
  'cake-5': 'tiramisu-cake',
  'tiramisu': 'tiramisu-cake',
  'cake-8': 'blueberry-cheesecake',
}

export function productSlug(id) {
  return aliases[id] || id
}

export function productHref(id) {
  if (id.startsWith('new-')) return `/new-menu/${id}`
  const best = ['strawberry-shortcake', 'chocolate-cake', 'matcha-cake'].includes(id)
  const home = ['tiramisu', 'blueberry-cheesecake'].includes(id)
  return `/menu/${productSlug(id)}${best ? '?option=best' : home ? '?option=home' : ''}`
}
