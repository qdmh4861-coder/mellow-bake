// New-menu proposal prices and copy supplied by the designer; existing catalog stays unchanged.
export const newMenuReference = '/images/7d2c9743-f504-4917-b8b9-4124678f332a.png'
const rows = [
  ['dubai-chocolate-croissant', 'bread', '빵', '두바이 초콜릿 크루아상', 'Dubai Chocolate Croissant', 6800, '바삭한 크루아상에 피스타치오와 초콜릿의 진한 풍미를 담은 디저트'],
  ['strawberry-pistachio-bun', 'bread', '빵', '딸기 피스타치오 크림빵', 'Strawberry Pistachio Cream Bun', 5900, '상큼한 딸기와 고소한 피스타치오 크림이 어우러진 부드러운 빵'],
  ['lemon-cream-danish', 'bread', '빵', '레몬 크림 데니시', 'Lemon Cream Danish', 5800, '상큼한 레몬 크림이 가득한 바삭하고 촉촉한 데니시'],
  ['black-sesame-brioche', 'bread', '빵', '흑임자 크림 브리오슈', 'Black Sesame Cream Brioche', 5600, '고소한 흑임자 크림을 듬뿍 담은 부드러운 브리오슈'],
  ['earl-grey-fig-cake', 'cake', '케이크', '얼그레이 무화과 케이크', 'Earl Grey Fig Cake', 8200, '향긋한 얼그레이 크림과 달콤한 무화과를 함께 즐기는 케이크'],
  ['yuja-cheese-mousse', 'cake', '케이크', '유자 치즈 무스 케이크', 'Yuja Cheese Mousse Cake', 7800, '유자의 산뜻한 향과 치즈 무스의 부드러움을 담은 케이크'],
  ['chocolate-hazelnut-mousse', 'cake', '케이크', '초코 헤이즐넛 무스 케이크', 'Chocolate Hazelnut Mousse Cake', 8500, '진한 초콜릿과 고소한 헤이즐넛이 어우러진 부드러운 무스 케이크'],
  ['berry-yogurt-mousse', 'cake', '케이크', '베리 요거트 무스 케이크', 'Berry Yogurt Mousse Cake', 8300, '상큼한 베리와 부드러운 요거트 무스를 담은 가벼운 디저트 케이크'],
  ['basil-chicken-focaccia', 'sandwich', '샌드위치', '바질 치킨 포카치아 샌드위치', 'Basil Chicken Focaccia Sandwich', 8900, '향긋한 바질과 치킨을 폭신한 포카치아에 담은 든든한 메뉴'],
  ['jambon-beurre', 'sandwich', '샌드위치', '잠봉뵈르 샌드위치', 'Jambon Beurre Sandwich', 8500, '바게트에 햄과 버터를 담아 담백하게 즐기는 프렌치 샌드위치'],
  ['strawberry-matcha-cream-latte', 'drink', '음료', '딸기 말차 크림 라떼', 'Strawberry Matcha Cream Latte', 6800, '딸기의 상큼함과 부드러운 말차 크림이 층층이 어우러진 라떼'],
  ['salted-caramel-milk-tea', 'drink', '음료', '솔티드 카라멜 밀크티', 'Salted Caramel Milk Tea', 6200, '달콤한 카라멜에 은은한 짭짤함을 더한 부드러운 밀크티'],
]
export const seasonalProducts = rows.map(([slug, category, categoryLabel, koreanName, name, price, description], index) => ({
  id: `new-${slug}`, category, categoryLabel, koreanName, name, price, description,
  detailHref: `/new-menu/new-${slug}`,
  // Set imageSrc after receiving the individual original. Never request a missing file.
  imageSrc: null, requestedImagePath: `/images/new-menu/${slug}.png`,
  photoBox: `${[146, 484, 814, 1146][index % 4]} ${[398, 600, 798][Math.floor(index / 4)]} ${index % 4 === 0 ? 294 : 292} 65`,
}))
