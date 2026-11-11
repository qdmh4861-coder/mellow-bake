# 전체 상품 상세페이지 적용 및 누락 자료 검수표

## 범위와 현재 상태

- 코드에 등록된 상품 ID 88개 / 공백을 제외한 상품명 86개. ID와 가격이 다른 HOME·MENU 판매 구성을 임의 통합하지 않았습니다.
- 보호 상품 3개를 제외한 상세 대상 85개. 소금빵(bread-1), 시나몬롤(bread-7), 불고기 샌드위치(sandwich-5) 유지.
- 상단 공통 구조와 상품별 데이터·대표 이미지 연결을 적용했습니다. **전체 상품의 개별 이미지 5장이 완성된 상태는 아닙니다.**
- 바스크 외 84개 상품은 추가 이미지 2~5번, 총 336장이 미제공입니다. 준비 중으로 표시하며 다른 상품으로 대체하지 않습니다.
- 신메뉴 12개는 제공된 신메뉴 시안의 해당 상품 그림을 표시합니다. 완전한 개별 원본은 별도로 필요하며, 화면에도 이 상태를 안내합니다.
- 누락 자료 총 348개 파일의 정확한 경로는 [product-detail-missing-images.csv](product-detail-missing-images.csv)에 있습니다.
- 실제 제조 공정 이미지·전체 원재료·함량·알레르기·교차 접촉·영양성분·보관 온도/기간·배송 정책은 미확인입니다. 기존 하단 내용을 유지하며 확인 중으로 안내합니다.
- 이미지 생성 도구는 사용 가능하지만, 현재 기존 상품 이미지를 우선 사용했습니다. 없는 추가 이미지를 임의의 다른 상품이나 추정 촬영 각도로 채우지 않았습니다.

## 디자인 및 연결

- 기준 파일: public/images/Frame 930.png (1216×693), public/images/바스크.png. 원본 파일 변경 없음.
- 바스크 상단은 Frame 930.png의 실제 상품/썸네일 영역만 사용합니다. 상품명·영문명·설명·가격·버튼은 JSX입니다. 시안의 잘못된 Cinnamon Roll, 예시 평점·리뷰 개수는 복사하지 않았습니다.
- 바스크: Basque Burnt Cheesecake / 29,000원 / 요청한 카라멜빛 겉면 설명 적용. 하단 완성 콘텐츠 유지.
- 다른 상세페이지는 UnifiedProductDetail을 통해 동일한 프레임·5개 썸네일 슬롯·상품정보/원재료/리뷰/Q&A를 표시합니다.
- ProductHero·ProductDetailBody의 containImages는 선택형이며 기본 동작은 유지합니다. 보호 페이지에는 적용하지 않습니다.
- 기존 상품 ID·가격·HOME 가격 옵션·경로를 유지합니다. 장바구니/찜 이미지 컴포넌트만 공통 이미지 표에 연결했습니다. 기존 장바구니 수량/합계/저장 방식 변경 없음.
- HOME·카테고리 페이지의 디자인, 상품 데이터 파일, 헤더·푸터·AI 상담은 수정하지 않았습니다. 각 상품 대표 일러스트는 기존 카테고리 이미지 표/원본 파일에서 찾습니다.
- 실제 주문·결제 화면은 없어 바로 구매는 기존의 연결 준비 안내를 유지합니다. 실제 결제 완료를 만들지 않습니다.
- Q&A는 기존 다이얼로그를 유지합니다. 문의 서버 및 답변 자료가 없다는 기존 안내를 유지합니다.

## 이미지 추가 방법

public/images/product-details/<상품 ID>/1.png ~ 5.png (JPG/JPEG/WebP도 가능)에 해당 상품의 실제 파일을 넣으면 공통 이미지 표가 찾아 표시합니다. 존재하는 파일만 로드하므로 준비 중 경로로 404 요청하지 않습니다. 보호 3개 상세페이지는 자동 교체 대상이 아닙니다.

## 실제 확인

- 85개 상세 경로: 상품 ID·한글명·영문명 데이터·가격·5개 슬롯·대표 이미지 source·브라우저 런타임 예외 확인.
- 1920px 기본 검사 및 834/402px에서 85개 전부: 가로 넘침·갤러리 겹침·필수 하단 섹션 존재 확인.
- 85개 상품: 수량 2 선택 후 장바구니 ID/가격/수량, 찜 ID/가격 저장 확인. 장바구니 85행 및 찜 전체 페이지 이미지 확인.
- 기존 찜의 장바구니 추가 성공 팝업 확인. 테스트 저장 데이터는 종료 시 복원.
- 보호 3개: 1920/834/402px HTML과 각 요소 크기·색상·패딩이 수정 전후 동일. 원본 JSX/CSS SHA-256 유지.
- Vite 빌드 성공. 기존 번들 크기 경고만 존재. oxlint 오류 없음; 기존 Cart의 set-state-in-effect / ProductDetail의 only-export-components 경고 유지.

## 추가/수정한 코드

- `src/productArtwork.js`
- `src/productCatalog.js`
- `src/components/CatalogProductImage.jsx`
- `src/components/UnifiedProductDetail.jsx`
- `src/components/UnifiedProductDetail.css`
- `src/components/ProductHero.jsx`
- `src/components/ProductDetailBody.jsx`
- `src/components/WishlistProductImage.jsx`
- `src/pages/ProductDetail.jsx`
- `src/pages/MontBlancDetail.jsx`
- `src/pages/SweetPotatoDetail.jsx`
- `src/pages/NewMenuDetail.jsx`
- `src/pages/BasqueCheesecakeDetail.jsx`
- `src/pages/BasqueCheesecakeDetail.css`
- `src/pages/Cart.jsx`
- `src/pages/Wishlist.jsx`

## 상품별 적용 목록

| ID | 상품명 | 영문명 | 가격 | 경로 | 대표 이미지 | 추가 이미지 |
|---|---|---|---:|---|---|---|
| bread-2 | 몽블랑 | Mont Blanc Bread | 4,800원 | /menu/bread-2 | /images/bread-list-clean/row-1.png | 2~5번 미제공 |
| bread-3 | 고구마 크림빵 | Sweet Potato Cream Bread | 3,200원 | /menu/bread-3 | /images/bread-list-clean/row-1.png | 2~5번 미제공 |
| bread-4 | 맘모스빵 | Mammoth Bread | 5,500원 | /menu/bread-4 | /images/bread-list-clean/row-1.png | 2~5번 미제공 |
| bread-5 | 육쪽 마늘빵 | Garlic Cream Cheese Bread | 4,500원 | /menu/bread-5 | /images/bread-list-clean/row-2.png | 2~5번 미제공 |
| bread-6 | 뺑오쇼콜라 | Pain au Chocolat | 4,200원 | /menu/bread-6 | /images/bread-list-clean/row-2.png | 2~5번 미제공 |
| bread-8 | 소시지빵 | Sausage Bread | 3,800원 | /menu/bread-8 | /images/bread-list-clean/row-2.png | 2~5번 미제공 |
| bread-9 | 아몬드 크루아상 | Almond Croissant | 4,900원 | /menu/bread-9 | /images/bread-list-clean/row-3.png | 2~5번 미제공 |
| bread-10 | 올리브 치아바타 | Olive Ciabatta | 3,900원 | /menu/bread-10 | /images/bread-list-clean/row-3.png | 2~5번 미제공 |
| bread-11 | 무화과 호두빵 | Fig Walnut Bread | 5,700원 | /menu/bread-11 | /images/bread-list-clean/row-3.png | 2~5번 미제공 |
| bread-12 | 우유 크림번 | Milk Cream Bun | 4,100원 | /menu/bread-12 | /images/bread-list-clean/row-3.png | 2~5번 미제공 |
| bread-13 | 감자 포카치아 | Potato Focaccia | 5,200원 | /menu/bread-13 | /images/bread-list-clean/row-4.png | 2~5번 미제공 |
| bread-14 | 얼그레이 브리오슈 | Earl Grey Brioche | 4,600원 | /menu/bread-14 | /images/bread-list-clean/row-4.png | 2~5번 미제공 |
| bread-15 | 밤 식빵 | Chestnut Loaf | 6,200원 | /menu/bread-15 | /images/bread-list-clean/row-4.png | 2~5번 미제공 |
| bread-16 | 애플 크럼블 데니시 | Apple Crumble Danish | 5,900원 | /menu/bread-16 | /images/bread-list-clean/row-4.png | 2~5번 미제공 |
| sandwich-1 | 햄치즈 샌드위치 | Ham & Cheese Sandwich | 5,800원 | /menu/sandwich-1 | /images/sandwich-list-clean/row-1.png | 2~5번 미제공 |
| sandwich-2 | 에그 샌드위치 | Egg Sandwich | 5,500원 | /menu/sandwich-2 | /images/sandwich-list-clean/row-1.png | 2~5번 미제공 |
| sandwich-3 | 치킨 샌드위치 | Chicken Sandwich | 6,500원 | /menu/sandwich-3 | /images/sandwich-list-clean/row-1.png | 2~5번 미제공 |
| sandwich-4 | BLT 샌드위치 | BLT Sandwich | 6,800원 | /menu/sandwich-4 | /images/sandwich-list-clean/row-1.png | 2~5번 미제공 |
| sandwich-6 | 아보카도 샌드위치 | Avocado Sandwich | 6,800원 | /menu/sandwich-6 | /images/sandwich-list-clean/row-2.png | 2~5번 미제공 |
| sandwich-7 | 크루아상 샌드위치 | Croissant Sandwich | 6,800원 | /menu/sandwich-7 | /images/sandwich-list-clean/row-2.png | 2~5번 미제공 |
| sandwich-8 | 바질 토마토 샌드위치 | Basil Tomato Sandwich | 6,500원 | /menu/sandwich-8 | /images/sandwich-list-clean/row-2.png | 2~5번 미제공 |
| sandwich-9 | 참치 콘 샌드위치 | Tuna Corn Sandwich | 5,900원 | /menu/sandwich-9 | /images/sandwich-list-clean/row-3.png | 2~5번 미제공 |
| sandwich-10 | 감자 샐러드 샌드위치 | Potato Salad Sandwich | 6,200원 | /menu/sandwich-10 | /images/sandwich-list-clean/row-3.png | 2~5번 미제공 |
| sandwich-11 | 머쉬룸 멜트 샌드위치 | Mushroom Melt Sandwich | 6,900원 | /menu/sandwich-11 | /images/sandwich-list-clean/row-3.png | 2~5번 미제공 |
| sandwich-12 | 터키 크랜베리 샌드위치 | Turkey Cranberry Sandwich | 7,200원 | /menu/sandwich-12 | /images/sandwich-list-clean/row-3.png | 2~5번 미제공 |
| sandwich-13 | 쉬림프 양배추 샌드위치 | Shrimp Cabbage Sandwich | 7,500원 | /menu/sandwich-13 | /images/sandwich-list-clean/row-4.png | 2~5번 미제공 |
| sandwich-14 | 훈제연어 베이글 샌드위치 | Smoked Salmon Bagel | 8,100원 | /menu/sandwich-14 | /images/sandwich-list-clean/row-4.png | 2~5번 미제공 |
| sandwich-15 | 로스트비프 샌드위치 | Roast Beef Sandwich | 8,400원 | /menu/sandwich-15 | /images/sandwich-list-clean/row-4.png | 2~5번 미제공 |
| sandwich-16 | 그릴드 채소 파니니 | Grilled Vegetable Panini | 7,800원 | /menu/sandwich-16 | /images/sandwich-list-clean/row-4.png | 2~5번 미제공 |
| cake-1 | 딸기 생크림 케이크 | Strawberry Fresh Cream Cake | 32,000원 | /menu/strawberry-cream-cake | /images/cake-list-clean/row-1.png | 2~5번 미제공 |
| cake-2 | 바스크 치즈 케이크 | Basque Burnt Cheesecake | 29,000원 | /menu/cake-2 | /images/Frame 930.png | 5개 확보 |
| cake-3 | 초콜릿 가나슈 케이크 | Chocolate Ganache Cake | 34,000원 | /menu/chocolate-cake | /images/cake-list-clean/row-1.png | 2~5번 미제공 |
| cake-4 | 말차 크림 케이크 | Matcha Cream Cake | 33,000원 | /menu/matcha-cake | /images/cake-list-clean/row-1.png | 2~5번 미제공 |
| cake-5 | 티라미수 케이크 | Tiramisu Cake | 34,000원 | /menu/tiramisu-cake | /images/cake-list-clean/row-2.png | 2~5번 미제공 |
| cake-6 | 레드벨벳 케이크 | Red Velvet Cake | 35,000원 | /menu/cake-6 | /images/cake-list-clean/row-2.png | 2~5번 미제공 |
| cake-7 | 당근 케이크 | Carrot Cake | 32,000원 | /menu/cake-7 | /images/cake-list-clean/row-2.png | 2~5번 미제공 |
| cake-8 | 블루베리 치즈케이크 | Blueberry Cheesecake | 33,000원 | /menu/blueberry-cheesecake | /images/cake-list-clean/row-2.png | 2~5번 미제공 |
| cake-9 | 레몬 요거트 케이크 | Lemon Yogurt Cake | 30,000원 | /menu/cake-9 | /images/cake-list-clean/row-3.png | 2~5번 미제공 |
| cake-10 | 복숭아 얼그레이 케이크 | Peach Earl Grey Cake | 36,000원 | /menu/cake-10 | /images/cake-list-clean/row-3.png | 2~5번 미제공 |
| cake-11 | 흑임자 크림 케이크 | Black Sesame Cream Cake | 31,000원 | /menu/cake-11 | /images/cake-list-clean/row-3.png | 2~5번 미제공 |
| cake-12 | 망고 코코넛 케이크 | Mango Coconut Cake | 37,000원 | /menu/cake-12 | /images/cake-list-clean/row-3.png | 2~5번 미제공 |
| cake-13 | 라즈베리 피스타치오 케이크 | Raspberry Pistachio Cake | 39,000원 | /menu/cake-13 | /images/cake-list-clean/row-4.png | 2~5번 미제공 |
| cake-14 | 허니 카스텔라 케이크 | Honey Castella Cake | 28,000원 | /menu/cake-14 | /images/cake-list-clean/row-4.png | 2~5번 미제공 |
| cake-15 | 밤 몽블랑 케이크 | Chestnut Mont Blanc Cake | 38,000원 | /menu/cake-15 | /images/cake-list-clean/row-4.png | 2~5번 미제공 |
| cake-16 | 솔티드 카라멜 무스 케이크 | Salted Caramel Mousse Cake | 40,000원 | /menu/cake-16 | /images/cake-list-clean/row-4.png | 2~5번 미제공 |
| drink-1 | 아이스 아메리카노 | Iced Americano | 4,500원 | /menu/drink-1 | /images/drink-list-clean/row-1.png | 2~5번 미제공 |
| drink-2 | 아이스 카페라떼 | Iced Cafe Latte | 5,000원 | /menu/drink-2 | /images/drink-list-clean/row-1.png | 2~5번 미제공 |
| drink-3 | 아이스 바닐라 라떼 | Iced Vanilla Latte | 5,500원 | /menu/drink-3 | /images/drink-list-clean/row-1.png | 2~5번 미제공 |
| drink-4 | 아이스 카라멜 마키아토 | Iced Caramel Macchiato | 5,500원 | /menu/drink-4 | /images/drink-list-clean/row-1.png | 2~5번 미제공 |
| drink-5 | 딸기 라떼 | Strawberry Latte | 5,800원 | /menu/drink-5 | /images/drink-list-clean/row-2.png | 2~5번 미제공 |
| drink-6 | 아이스 말차 라떼 | Iced Matcha Latte | 5,500원 | /menu/drink-6 | /images/drink-list-clean/row-2.png | 2~5번 미제공 |
| drink-7 | 레몬 에이드 | Lemon Ade | 5,800원 | /menu/drink-7 | /images/drink-list-clean/row-2.png | 2~5번 미제공 |
| drink-8 | 복숭아 아이스티 | Peach Iced Tea | 5,000원 | /menu/drink-8 | /images/drink-list-clean/row-2.png | 2~5번 미제공 |
| drink-9 | 콜드브루 | Cold Brew | 4,800원 | /menu/drink-9 | /images/drink-list-clean/row-3.png | 2~5번 미제공 |
| drink-10 | 허니 캐모마일 티 | Honey Chamomile Tea | 4,600원 | /menu/drink-10 | /images/drink-list-clean/row-3.png | 2~5번 미제공 |
| drink-11 | 자몽 에이드 | Grapefruit Ade | 6,000원 | /menu/drink-11 | /images/drink-list-clean/row-3.png | 2~5번 미제공 |
| drink-12 | 블루베리 요거트 스무디 | Blueberry Yogurt Smoothie | 6,500원 | /menu/drink-12 | /images/drink-list-clean/row-3.png | 2~5번 미제공 |
| drink-13 | 흑임자 라떼 | Black Sesame Latte | 5,600원 | /menu/drink-13 | /images/drink-list-clean/row-4.png | 2~5번 미제공 |
| drink-14 | 제주 청귤 티 | Jeju Tangerine Tea | 5,200원 | /menu/drink-14 | /images/drink-list-clean/row-4.png | 2~5번 미제공 |
| drink-15 | 코코넛 커피 쉐이크 | Coconut Coffee Shake | 6,800원 | /menu/drink-15 | /images/drink-list-clean/row-4.png | 2~5번 미제공 |
| drink-16 | 라즈베리 히비스커스 티 | Raspberry Hibiscus Tea | 6,200원 | /menu/drink-16 | /images/drink-list-clean/row-4.png | 2~5번 미제공 |
| strawberry-shortcake | 딸기 생크림 케이크 | Strawberry Shortcake | 7,500원 | /menu/strawberry-cream-cake?option=best | /src/assets/best-menu/strawberry-shortcake.png | 2~5번 미제공 |
| chocolate-cake | 초콜릿 케이크 | Chocolate Cake | 6,900원 | /menu/chocolate-cake?option=best | /src/assets/best-menu/chocolate-cake.png | 2~5번 미제공 |
| matcha-cake | 말차 케이크 | Matcha Cake | 6,800원 | /menu/matcha-cake?option=best | /src/assets/best-menu/matcha-cake.png | 2~5번 미제공 |
| strawberry-roll-cake | 딸기 롤케이크 | Strawberry Roll Cake | 6,300원 | /menu/strawberry-roll-cake | /src/assets/best-menu/strawberry-roll-cake.png | 2~5번 미제공 |
| blueberry-cheesecake | 블루베리 치즈 케이크 | Blueberry Cheesecake | 6,500원 | /menu/blueberry-cheesecake?option=home | /src/assets/new-menu/blueberry-cheesecake.png | 2~5번 미제공 |
| tiramisu | 티라미수 | Tiramisu | 6,800원 | /menu/tiramisu-cake?option=home | /src/assets/new-menu/tiramisu.png | 2~5번 미제공 |
| lemon-tart | 레몬 타르트 | Lemon Tart | 6,500원 | /menu/lemon-tart | /src/assets/new-menu/lemon-tart.png | 2~5번 미제공 |
| fruit-tart | 생과일 타르트 | Fruit Tart | 7,200원 | /menu/fruit-tart | /src/assets/new-menu/fruit-tart.png | 2~5번 미제공 |
| salted-caramel-financier | 솔티드 카라멜 휘낭시에 | Salted Caramel Financier | 3,800원 | /menu/salted-caramel-financier | /src/assets/new-arrivals/salted-caramel-financier.png | 2~5번 미제공 |
| earl-grey-scone | 얼그레이 스콘 | Earl Grey Scone | 3,500원 | /menu/earl-grey-scone | /src/assets/new-arrivals/earl-grey-scone.png | 2~5번 미제공 |
| pistachio-cream-croissant | 피스타치오 크림 크루아상 | Pistachio Cream Croissant | 4,800원 | /menu/pistachio-cream-croissant | /src/assets/new-arrivals/pistachio-cream-croissant.png | 2~5번 미제공 |
| peach-yogurt-mousse | 복숭아 요거트 무스 | Peach Yogurt Mousse | 4,500원 | /menu/peach-yogurt-mousse | /src/assets/new-arrivals/peach-yogurt-mousse.png | 2~5번 미제공 |
| new-dubai-chocolate-croissant | 두바이 초콜릿 크루아상 | Dubai Chocolate Croissant | 6,800원 | /new-menu/new-dubai-chocolate-croissant | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-strawberry-pistachio-bun | 딸기 피스타치오 크림빵 | Strawberry Pistachio Cream Bun | 5,900원 | /new-menu/new-strawberry-pistachio-bun | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-lemon-cream-danish | 레몬 크림 데니시 | Lemon Cream Danish | 5,800원 | /new-menu/new-lemon-cream-danish | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-black-sesame-brioche | 흑임자 크림 브리오슈 | Black Sesame Cream Brioche | 5,600원 | /new-menu/new-black-sesame-brioche | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-earl-grey-fig-cake | 얼그레이 무화과 케이크 | Earl Grey Fig Cake | 8,200원 | /new-menu/new-earl-grey-fig-cake | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-yuja-cheese-mousse | 유자 치즈 무스 케이크 | Yuja Cheese Mousse Cake | 7,800원 | /new-menu/new-yuja-cheese-mousse | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-chocolate-hazelnut-mousse | 초코 헤이즐넛 무스 케이크 | Chocolate Hazelnut Mousse Cake | 8,500원 | /new-menu/new-chocolate-hazelnut-mousse | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-berry-yogurt-mousse | 베리 요거트 무스 케이크 | Berry Yogurt Mousse Cake | 8,300원 | /new-menu/new-berry-yogurt-mousse | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-basil-chicken-focaccia | 바질 치킨 포카치아 샌드위치 | Basil Chicken Focaccia Sandwich | 8,900원 | /new-menu/new-basil-chicken-focaccia | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-jambon-beurre | 잠봉뵈르 샌드위치 | Jambon Beurre Sandwich | 8,500원 | /new-menu/new-jambon-beurre | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-strawberry-matcha-cream-latte | 딸기 말차 크림 라떼 | Strawberry Matcha Cream Latte | 6,800원 | /new-menu/new-strawberry-matcha-cream-latte | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |
| new-salted-caramel-milk-tea | 솔티드 카라멜 밀크티 | Salted Caramel Milk Tea | 6,200원 | /new-menu/new-salted-caramel-milk-tea | /images/7d2c9743-f504-4917-b8b9-4124678f332a.png (시안 영역; 개별 원본 필요) | 2~5번 미제공 |

전체 상세 데이터 및 이미지 영역 좌표는 [product-detail-products.json](product-detail-products.json)을 참고하세요.
