# 상품 상세페이지 적용 결과

- 보호 대상: 소금빵·시나몬롤·불고기 샌드위치. 해당 페이지 파일 수정 없음. 3개 화면의 본문 HTML과 크기·스타일을 1920/834/402px에서 수정 전과 비교하여 일치 확인.
- 바스크 치즈케이크: public/images/바스크치즈.png의 일러스트 영역을 SVG로 연결. 텍스트·표·버튼은 HTML로 유지. 원본 이미지 변경 없음. 가격 29,000원, 영문명 Basque Burnt Cheesecake.
- 이미 연결되어 있던 기본형 상세페이지 84개를 상품별 콘텐츠로 보완. 새 경로 및 중복 페이지 생성 없음. 상품 목록은 아래 표 참조.
- HOME/MENU 카드 이미지, 보호 상세페이지, 공통 헤더·푸터 변경 없음.

## 아직 필요한 이미지

상품별 상세 연출 1092개가 필요합니다. product-story-image-requirements.csv에 상품명·용도·권장 크기·저장 경로를 기록했습니다. 실제 파일을 해당 위치에 추가하면 연결됩니다. 다른 상품 이미지나 메인 이미지 확대본으로 대체하지 않았습니다. 기존 갤러리 추가 사진 및 시즌 상품 원본 348개 요청은 product-detail-missing-images.csv를 참고하세요.

## 데이터의 한계

상품 소개는 기존 설명을 기준으로 작성했습니다. 확인되지 않은 원재료·알레르기·영양·소비기한·제조 및 배송 조건은 확인 필요 또는 디자인 예시로 표시합니다. 구매 후기를 생성하지 않았으며 실제 저장 리뷰만 연결합니다. 리뷰가 없으면 4개 영역에 빈 상태를 표시합니다. 실제 결제 완료 기능은 없습니다.

## 검증

85개 대상 경로를 1920/834/402px에서 검사: 상품 ID·이름, 썸네일 5칸, 상세 섹션, 가로 넘침, 실행 예외 검사 통과. 보호 3개 본문 변경 없음. 상품별 상세 이미지가 준비되지 않아 모든 상세페이지가 최종 이미지까지 완성된 상태는 아닙니다.

|상품 ID|상품명|경로|
|---|---|---|
|bread-2|몽블랑|/menu/bread-2|
|bread-3|고구마 크림빵|/menu/bread-3|
|bread-4|맘모스빵|/menu/bread-4|
|bread-5|육쪽 마늘빵|/menu/bread-5|
|bread-6|뺑오쇼콜라|/menu/bread-6|
|bread-8|소시지빵|/menu/bread-8|
|bread-9|아몬드 크루아상|/menu/bread-9|
|bread-10|올리브 치아바타|/menu/bread-10|
|bread-11|무화과 호두빵|/menu/bread-11|
|bread-12|우유 크림번|/menu/bread-12|
|bread-13|감자 포카치아|/menu/bread-13|
|bread-14|얼그레이 브리오슈|/menu/bread-14|
|bread-15|밤 식빵|/menu/bread-15|
|bread-16|애플 크럼블 데니시|/menu/bread-16|
|sandwich-1|햄치즈 샌드위치|/menu/sandwich-1|
|sandwich-2|에그 샌드위치|/menu/sandwich-2|
|sandwich-3|치킨 샌드위치|/menu/sandwich-3|
|sandwich-4|BLT 샌드위치|/menu/sandwich-4|
|sandwich-6|아보카도 샌드위치|/menu/sandwich-6|
|sandwich-7|크루아상 샌드위치|/menu/sandwich-7|
|sandwich-8|바질 토마토 샌드위치|/menu/sandwich-8|
|sandwich-9|참치 콘 샌드위치|/menu/sandwich-9|
|sandwich-10|감자 샐러드 샌드위치|/menu/sandwich-10|
|sandwich-11|머쉬룸 멜트 샌드위치|/menu/sandwich-11|
|sandwich-12|터키 크랜베리 샌드위치|/menu/sandwich-12|
|sandwich-13|쉬림프 양배추 샌드위치|/menu/sandwich-13|
|sandwich-14|훈제연어 베이글 샌드위치|/menu/sandwich-14|
|sandwich-15|로스트비프 샌드위치|/menu/sandwich-15|
|sandwich-16|그릴드 채소 파니니|/menu/sandwich-16|
|cake-1|딸기 생크림 케이크|/menu/strawberry-cream-cake|
|cake-3|초콜릿 가나슈 케이크|/menu/chocolate-cake|
|cake-4|말차 크림 케이크|/menu/matcha-cake|
|cake-5|티라미수 케이크|/menu/tiramisu-cake|
|cake-6|레드벨벳 케이크|/menu/cake-6|
|cake-7|당근 케이크|/menu/cake-7|
|cake-8|블루베리 치즈케이크|/menu/blueberry-cheesecake|
|cake-9|레몬 요거트 케이크|/menu/cake-9|
|cake-10|복숭아 얼그레이 케이크|/menu/cake-10|
|cake-11|흑임자 크림 케이크|/menu/cake-11|
|cake-12|망고 코코넛 케이크|/menu/cake-12|
|cake-13|라즈베리 피스타치오 케이크|/menu/cake-13|
|cake-14|허니 카스텔라 케이크|/menu/cake-14|
|cake-15|밤 몽블랑 케이크|/menu/cake-15|
|cake-16|솔티드 카라멜 무스 케이크|/menu/cake-16|
|drink-1|아이스 아메리카노|/menu/drink-1|
|drink-2|아이스 카페라떼|/menu/drink-2|
|drink-3|아이스 바닐라 라떼|/menu/drink-3|
|drink-4|아이스 카라멜 마키아토|/menu/drink-4|
|drink-5|딸기 라떼|/menu/drink-5|
|drink-6|아이스 말차 라떼|/menu/drink-6|
|drink-7|레몬 에이드|/menu/drink-7|
|drink-8|복숭아 아이스티|/menu/drink-8|
|drink-9|콜드브루|/menu/drink-9|
|drink-10|허니 캐모마일 티|/menu/drink-10|
|drink-11|자몽 에이드|/menu/drink-11|
|drink-12|블루베리 요거트 스무디|/menu/drink-12|
|drink-13|흑임자 라떼|/menu/drink-13|
|drink-14|제주 청귤 티|/menu/drink-14|
|drink-15|코코넛 커피 쉐이크|/menu/drink-15|
|drink-16|라즈베리 히비스커스 티|/menu/drink-16|
|strawberry-shortcake|딸기 생크림 케이크|/menu/strawberry-cream-cake?option=best|
|chocolate-cake|초콜릿 케이크|/menu/chocolate-cake?option=best|
|matcha-cake|말차 케이크|/menu/matcha-cake?option=best|
|strawberry-roll-cake|딸기 롤케이크|/menu/strawberry-roll-cake|
|blueberry-cheesecake|블루베리 치즈 케이크|/menu/blueberry-cheesecake?option=home|
|tiramisu|티라미수|/menu/tiramisu-cake?option=home|
|lemon-tart|레몬 타르트|/menu/lemon-tart|
|fruit-tart|생과일 타르트|/menu/fruit-tart|
|salted-caramel-financier|솔티드 카라멜 휘낭시에|/menu/salted-caramel-financier|
|earl-grey-scone|얼그레이 스콘|/menu/earl-grey-scone|
|pistachio-cream-croissant|피스타치오 크림 크루아상|/menu/pistachio-cream-croissant|
|peach-yogurt-mousse|복숭아 요거트 무스|/menu/peach-yogurt-mousse|
|new-dubai-chocolate-croissant|두바이 초콜릿 크루아상|/new-menu/new-dubai-chocolate-croissant|
|new-strawberry-pistachio-bun|딸기 피스타치오 크림빵|/new-menu/new-strawberry-pistachio-bun|
|new-lemon-cream-danish|레몬 크림 데니시|/new-menu/new-lemon-cream-danish|
|new-black-sesame-brioche|흑임자 크림 브리오슈|/new-menu/new-black-sesame-brioche|
|new-earl-grey-fig-cake|얼그레이 무화과 케이크|/new-menu/new-earl-grey-fig-cake|
|new-yuja-cheese-mousse|유자 치즈 무스 케이크|/new-menu/new-yuja-cheese-mousse|
|new-chocolate-hazelnut-mousse|초코 헤이즐넛 무스 케이크|/new-menu/new-chocolate-hazelnut-mousse|
|new-berry-yogurt-mousse|베리 요거트 무스 케이크|/new-menu/new-berry-yogurt-mousse|
|new-basil-chicken-focaccia|바질 치킨 포카치아 샌드위치|/new-menu/new-basil-chicken-focaccia|
|new-jambon-beurre|잠봉뵈르 샌드위치|/new-menu/new-jambon-beurre|
|new-strawberry-matcha-cream-latte|딸기 말차 크림 라떼|/new-menu/new-strawberry-matcha-cream-latte|
|new-salted-caramel-milk-tea|솔티드 카라멜 밀크티|/new-menu/new-salted-caramel-milk-tea|
