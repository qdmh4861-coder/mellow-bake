# 상품 검색 적용 및 검증

## 변경 파일
- src/components/HomeHeader.jsx: 기존 돋보기의 검색 모달 열기 연결만 추가. 아이콘/위치/메뉴 유지.
- src/components/ProductSearch.jsx: 전체 등록 상품 검색, 카테고리, 상세 링크, 접근 가능한 포털 모달.
- src/components/ProductSearch.css: 검색 전용 스타일.

## 데이터와 이미지
- 기존 registeredProducts 88개 상품 ID(가격/판매 구성별 ID 포함) 사용.
- 기존 detailHref 재사용. 88개 목적지의 실제 상품 ID 검사 통과. 누락 상세페이지 없음.
- 기존 CatalogProductImage 재사용. 바스크 카드는 일반 케이크 목록 일러스트 사용.
- 토끼: public/images/member-cutouts/review-bunny.png
- 컵케이크: public/images/member-cutouts/review-cupcake.png
- 검색 최종 시안 파일은 확인되지 않아 사용자 명세에 따라 JSX/CSS/SVG로 구현.

## 남아 있는 이미지 자료
새 시즌 상품 12개는 기존 전체 시안의 해당 상품 그림을 사용하며, 개별 원본이 없습니다. 다른 상품 이미지를 대신 연결하지 않았습니다. 기존 HOME/MENU 이미지 변경 없음. 개별 이미지가 준비될 경우 기존 시즌 상품 데이터 연결 작업이 별도로 필요합니다.

|상품|개별 원본 필요 경로|
|---|---|
|두바이 초콜릿 크루아상|public/images/new-menu/dubai-chocolate-croissant.png|
|딸기 피스타치오 크림빵|public/images/new-menu/strawberry-pistachio-bun.png|
|레몬 크림 데니시|public/images/new-menu/lemon-cream-danish.png|
|흑임자 크림 브리오슈|public/images/new-menu/black-sesame-brioche.png|
|얼그레이 무화과 케이크|public/images/new-menu/earl-grey-fig-cake.png|
|유자 치즈 무스 케이크|public/images/new-menu/yuja-cheese-mousse.png|
|초코 헤이즐넛 무스 케이크|public/images/new-menu/chocolate-hazelnut-mousse.png|
|베리 요거트 무스 케이크|public/images/new-menu/berry-yogurt-mousse.png|
|바질 치킨 포카치아 샌드위치|public/images/new-menu/basil-chicken-focaccia.png|
|잠봉뵈르 샌드위치|public/images/new-menu/jambon-beurre.png|
|딸기 말차 크림 라떼|public/images/new-menu/strawberry-matcha-cream-latte.png|
|솔티드 카라멜 밀크티|public/images/new-menu/salted-caramel-milk-tea.png|

## 검증
- 1920/834/402px 실제 브라우저: PC/태블릿 2열, 모바일 1열, 가로 넘침 없음.
- 열기, 자동 포커스, ESC/X/바깥 클릭 닫기, 스크롤 잠금/복원 통과.
- 한글/영문/대소문자/공백 검색, 필터 조합, 빈 결과, 초기화 통과.
- 소금빵 카드 실제 클릭 후 기존 상세 이동 및 scrollY=0 확인.
- 전체 88개 상세 경로의 상품 ID 연결 검사 통과, 런타임 예외 없음.

## 연결 경로
|상품 ID|기존 상세 경로|
|---|---|
|bread-1|/menu/salt-bread|
|bread-2|/menu/bread-2|
|bread-3|/menu/bread-3|
|bread-4|/menu/bread-4|
|bread-5|/menu/bread-5|
|bread-6|/menu/bread-6|
|bread-7|/menu/cinnamon-roll|
|bread-8|/menu/bread-8|
|bread-9|/menu/bread-9|
|bread-10|/menu/bread-10|
|bread-11|/menu/bread-11|
|bread-12|/menu/bread-12|
|bread-13|/menu/bread-13|
|bread-14|/menu/bread-14|
|bread-15|/menu/bread-15|
|bread-16|/menu/bread-16|
|sandwich-1|/menu/sandwich-1|
|sandwich-2|/menu/sandwich-2|
|sandwich-3|/menu/sandwich-3|
|sandwich-4|/menu/sandwich-4|
|sandwich-5|/menu/bulgogi-sandwich|
|sandwich-6|/menu/sandwich-6|
|sandwich-7|/menu/sandwich-7|
|sandwich-8|/menu/sandwich-8|
|sandwich-9|/menu/sandwich-9|
|sandwich-10|/menu/sandwich-10|
|sandwich-11|/menu/sandwich-11|
|sandwich-12|/menu/sandwich-12|
|sandwich-13|/menu/sandwich-13|
|sandwich-14|/menu/sandwich-14|
|sandwich-15|/menu/sandwich-15|
|sandwich-16|/menu/sandwich-16|
|cake-1|/menu/strawberry-cream-cake|
|cake-2|/menu/cake-2|
|cake-3|/menu/chocolate-cake|
|cake-4|/menu/matcha-cake|
|cake-5|/menu/tiramisu-cake|
|cake-6|/menu/cake-6|
|cake-7|/menu/cake-7|
|cake-8|/menu/blueberry-cheesecake|
|cake-9|/menu/cake-9|
|cake-10|/menu/cake-10|
|cake-11|/menu/cake-11|
|cake-12|/menu/cake-12|
|cake-13|/menu/cake-13|
|cake-14|/menu/cake-14|
|cake-15|/menu/cake-15|
|cake-16|/menu/cake-16|
|drink-1|/menu/drink-1|
|drink-2|/menu/drink-2|
|drink-3|/menu/drink-3|
|drink-4|/menu/drink-4|
|drink-5|/menu/drink-5|
|drink-6|/menu/drink-6|
|drink-7|/menu/drink-7|
|drink-8|/menu/drink-8|
|drink-9|/menu/drink-9|
|drink-10|/menu/drink-10|
|drink-11|/menu/drink-11|
|drink-12|/menu/drink-12|
|drink-13|/menu/drink-13|
|drink-14|/menu/drink-14|
|drink-15|/menu/drink-15|
|drink-16|/menu/drink-16|
|strawberry-shortcake|/menu/strawberry-cream-cake?option=best|
|chocolate-cake|/menu/chocolate-cake?option=best|
|matcha-cake|/menu/matcha-cake?option=best|
|strawberry-roll-cake|/menu/strawberry-roll-cake|
|blueberry-cheesecake|/menu/blueberry-cheesecake?option=home|
|tiramisu|/menu/tiramisu-cake?option=home|
|lemon-tart|/menu/lemon-tart|
|fruit-tart|/menu/fruit-tart|
|salted-caramel-financier|/menu/salted-caramel-financier|
|earl-grey-scone|/menu/earl-grey-scone|
|pistachio-cream-croissant|/menu/pistachio-cream-croissant|
|peach-yogurt-mousse|/menu/peach-yogurt-mousse|
|new-dubai-chocolate-croissant|/new-menu/new-dubai-chocolate-croissant|
|new-strawberry-pistachio-bun|/new-menu/new-strawberry-pistachio-bun|
|new-lemon-cream-danish|/new-menu/new-lemon-cream-danish|
|new-black-sesame-brioche|/new-menu/new-black-sesame-brioche|
|new-earl-grey-fig-cake|/new-menu/new-earl-grey-fig-cake|
|new-yuja-cheese-mousse|/new-menu/new-yuja-cheese-mousse|
|new-chocolate-hazelnut-mousse|/new-menu/new-chocolate-hazelnut-mousse|
|new-berry-yogurt-mousse|/new-menu/new-berry-yogurt-mousse|
|new-basil-chicken-focaccia|/new-menu/new-basil-chicken-focaccia|
|new-jambon-beurre|/new-menu/new-jambon-beurre|
|new-strawberry-matcha-cream-latte|/new-menu/new-strawberry-matcha-cream-latte|
|new-salted-caramel-milk-tea|/new-menu/new-salted-caramel-milk-tea|
