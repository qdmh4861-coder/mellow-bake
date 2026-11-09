import { productHref } from './productLinks'

// Additional products are used only by the home category listing routes.
export const homeCategoryProducts = {
  bread: [
    ['Almond Croissant', '아몬드 크루아상', '아몬드 크림과 슬라이스 아몬드를 올린 바삭한 크루아상', 4900],
    ['Olive Ciabatta', '올리브 치아바타', '블랙 올리브를 넣어 짭조름하고 쫄깃한 식사빵', 3900],
    ['Fig Walnut Bread', '무화과 호두빵', '말린 무화과와 호두를 담아 은은하게 달콤한 빵', 5700],
    ['Milk Cream Bun', '우유 크림번', '폭신한 번 속에 부드러운 우유 크림을 채운 빵', 4100],
    ['Potato Focaccia', '감자 포카치아', '감자와 로즈메리를 올려 향긋하게 구운 포카치아', 5200],
    ['Earl Grey Brioche', '얼그레이 브리오슈', '버터 향에 얼그레이 찻잎의 풍미를 더한 브리오슈', 4600],
    ['Chestnut Loaf', '밤 식빵', '포슬한 밤 조각을 넣어 한 장씩 즐기는 부드러운 식빵', 6200],
    ['Apple Crumble Danish', '애플 크럼블 데니시', '사과 조림과 크럼블을 올린 겹겹의 데니시', 5900],
  ],
  sandwich: [
    ['Tuna Corn Sandwich', '참치 콘 샌드위치', '담백한 참치와 톡톡 터지는 옥수수를 담은 샌드위치', 5900],
    ['Potato Salad Sandwich', '감자 샐러드 샌드위치', '포슬한 감자 샐러드와 아삭한 오이를 곁들인 샌드위치', 6200],
    ['Mushroom Melt Sandwich', '머쉬룸 멜트 샌드위치', '구운 버섯과 녹인 치즈를 통밀빵에 채운 샌드위치', 6900],
    ['Turkey Cranberry Sandwich', '터키 크랜베리 샌드위치', '칠면조 슬라이스와 새콤한 크랜베리 소스를 담은 샌드위치', 7200],
    ['Shrimp Cabbage Sandwich', '쉬림프 양배추 샌드위치', '새우와 양배추 슬로에 레몬 소스를 곁들인 샌드위치', 7500],
    ['Smoked Salmon Bagel', '훈제연어 베이글 샌드위치', '훈제연어와 크림치즈, 케이퍼를 담은 쫄깃한 베이글', 8100],
    ['Roast Beef Sandwich', '로스트비프 샌드위치', '로스트비프와 루콜라에 홀그레인 머스터드를 곁들인 샌드위치', 8400],
    ['Grilled Vegetable Panini', '그릴드 채소 파니니', '구운 가지와 주키니, 모차렐라를 넣어 구운 파니니', 7800],
  ],
  cake: [
    ['Lemon Yogurt Cake', '레몬 요거트 케이크', '레몬 커드와 산뜻한 요거트 크림을 겹겹이 채운 케이크', 30000],
    ['Peach Earl Grey Cake', '복숭아 얼그레이 케이크', '얼그레이 시트에 복숭아와 밀크티 크림을 담은 케이크', 36000],
    ['Black Sesame Cream Cake', '흑임자 크림 케이크', '볶은 흑임자와 우유 크림이 고소하게 어우러진 케이크', 31000],
    ['Mango Coconut Cake', '망고 코코넛 케이크', '망고 퓌레와 코코넛 무스를 쌓은 열대 과일 케이크', 37000],
    ['Raspberry Pistachio Cake', '라즈베리 피스타치오 케이크', '피스타치오 시트에 새콤한 라즈베리 콩피를 더한 케이크', 39000],
    ['Honey Castella Cake', '허니 카스텔라 케이크', '꿀 카스텔라에 담백한 생크림을 곁들인 케이크', 28000],
    ['Chestnut Mont Blanc Cake', '밤 몽블랑 케이크', '밤 페이스트와 바닐라 크림을 올린 부드러운 케이크', 38000],
    ['Salted Caramel Mousse Cake', '솔티드 카라멜 무스 케이크', '카라멜 무스에 소금의 여운과 크런치를 더한 케이크', 40000],
  ],
  drink: [
    ['Cold Brew', '콜드브루', '찬물로 천천히 추출해 부드러운 여운을 살린 커피', 4800],
    ['Honey Chamomile Tea', '허니 캐모마일 티', '캐모마일 꽃향기에 꿀의 은은한 단맛을 더한 허브티', 4600],
    ['Grapefruit Ade', '자몽 에이드', '자몽 과육의 쌉싸름함을 탄산과 즐기는 과일 에이드', 6000],
    ['Blueberry Yogurt Smoothie', '블루베리 요거트 스무디', '블루베리와 플레인 요거트를 곱게 갈아 만든 스무디', 6500],
    ['Black Sesame Latte', '흑임자 라떼', '흑임자 페이스트와 우유로 고소하게 즐기는 라떼', 5600],
    ['Jeju Tangerine Tea', '제주 청귤 티', '청귤청과 귤 조각을 넣어 산뜻하게 즐기는 과일차', 5200],
    ['Coconut Coffee Shake', '코코넛 커피 쉐이크', '에스프레소와 코코넛 밀크를 블렌딩한 시원한 쉐이크', 6800],
    ['Raspberry Hibiscus Tea', '라즈베리 히비스커스 티', '라즈베리와 히비스커스의 붉은 과일 향을 살린 티', 6200],
  ],
}

export function withHomeCategoryProducts(categories) {
  return categories.map(category => ({
    ...category,
    products: [...category.products, ...homeCategoryProducts[category.id].map(([name, koreanName, description, price], index) => ({
      id: category.id + '-' + (category.products.length + index + 1),
      name, koreanName, description, price,
      imageSrc: null, detailHref: productHref(category.id + '-' + (category.products.length + index + 1)), isTemporary: false,
    }))],
  }))
}