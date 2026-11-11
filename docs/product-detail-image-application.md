# 상품별 상세 이미지 적용

## 바스크 지정 배너
- 파일: public/images/주석 2026-11-11 114841.png
- 위치: /menu/cake-2 → #product-introduction, 구매 정보 아래 기존 소개 배너.
- 완성 배너 자체에 문구·로고·캐릭터가 포함되어 기존 중복 HTML 문구와 장식을 제거하고 원본 비율로 표시.
- 나머지 바스크 정상 이미지 유지.

## 새 상품별 연출
- 대상 84개 상품 ID, 저장된 전용 이미지 시트 84개.
- 상품별 4x4 시트의 16개 서로 다른 장면을 각각 연결: 소개·특징·주요 재료·제작 과정3·즐기는 방법3·매력3·핵심 재료·보관3.
- 추가 썸네일4개는 해당 상품의 특징·매력·즐기는 장면을 연결. 기존 대표 이미지는 유지.
- 동일 상품의 시트를 여러 섹션에서 이용하되 좌표가 다르며, 다른 상품의 이미지로 대체하지 않음.
- 첫 몽블랑 소개 배너는 별도 생성한 signature.png를 우선 사용. 개별 목적 이미지가 존재하면 시트보다 우선 사용.
- 원본/기존 이미지를 수정하거나 덮어쓰지 않음.
- 모든 생성은 built-in image_gen 사용. 최종 프롬프트 및 파일별 경로는 generated-product-image-prompts.json 참조.

## 남은 자료
요청 대상 84개 상품의 새 상세 연출 슬롯은 모두 연결됨.
- 실제 구매 후기 사진: 기존 리뷰 데이터의 첨부 사진만 표시. 생성 이미지를 실제 후기 사진으로 표시하지 않음. 사용자 리뷰가 없으면 빈 상태 유지.
- 시즌 신상품12개의 개별 대표 원본은 기존에 없으며, 기존 목록/상세의 시안 상품 그림 표시를 유지. HOME/MENU 카드 원본 변경 없음. 기존 요청 경로는 product-detail-missing-images.csv 중 신상품 대표 이미지 항목 참조.
- 생성 원재료·과정·보관 그림은 포트폴리오용 연출이며 실제 레시피/알레르기/소비기한을 확정한 정보가 아님.

## 보호 및 경로
소금빵·시나몬롤·불고기 샌드위치 파일/화면 유지. 헤더·푸터·HOME/MENU·카테고리·장바구니·찜·로그인 수정 없음. 기존 상세 경로 유지.

|상품 ID|상품명|상세 경로|파일|
|---|---|---|---|
|bread-2|몽블랑|/menu/bread-2|/images/product-details/bread-2/story-sheet.png|
|bread-3|고구마 크림빵|/menu/bread-3|/images/product-details/bread-3/story-sheet.png|
|bread-4|맘모스빵|/menu/bread-4|/images/product-details/bread-4/story-sheet.png|
|bread-5|육쪽 마늘빵|/menu/bread-5|/images/product-details/bread-5/story-sheet.png|
|bread-6|뺑오쇼콜라|/menu/bread-6|/images/product-details/bread-6/story-sheet.png|
|bread-8|소시지빵|/menu/bread-8|/images/product-details/bread-8/story-sheet.png|
|bread-9|아몬드 크루아상|/menu/bread-9|/images/product-details/bread-9/story-sheet.png|
|bread-10|올리브 치아바타|/menu/bread-10|/images/product-details/bread-10/story-sheet.png|
|bread-11|무화과 호두빵|/menu/bread-11|/images/product-details/bread-11/story-sheet.png|
|bread-12|우유 크림번|/menu/bread-12|/images/product-details/bread-12/story-sheet.png|
|bread-13|감자 포카치아|/menu/bread-13|/images/product-details/bread-13/story-sheet.png|
|bread-14|얼그레이 브리오슈|/menu/bread-14|/images/product-details/bread-14/story-sheet.png|
|bread-15|밤 식빵|/menu/bread-15|/images/product-details/bread-15/story-sheet.png|
|bread-16|애플 크럼블 데니시|/menu/bread-16|/images/product-details/bread-16/story-sheet.png|
|sandwich-1|햄치즈 샌드위치|/menu/sandwich-1|/images/product-details/sandwich-1/story-sheet.png|
|sandwich-2|에그 샌드위치|/menu/sandwich-2|/images/product-details/sandwich-2/story-sheet.png|
|sandwich-3|치킨 샌드위치|/menu/sandwich-3|/images/product-details/sandwich-3/story-sheet.png|
|sandwich-4|BLT 샌드위치|/menu/sandwich-4|/images/product-details/sandwich-4/story-sheet.png|
|sandwich-6|아보카도 샌드위치|/menu/sandwich-6|/images/product-details/sandwich-6/story-sheet.png|
|sandwich-7|크루아상 샌드위치|/menu/sandwich-7|/images/product-details/sandwich-7/story-sheet.png|
|sandwich-8|바질 토마토 샌드위치|/menu/sandwich-8|/images/product-details/sandwich-8/story-sheet.png|
|sandwich-9|참치 콘 샌드위치|/menu/sandwich-9|/images/product-details/sandwich-9/story-sheet.png|
|sandwich-10|감자 샐러드 샌드위치|/menu/sandwich-10|/images/product-details/sandwich-10/story-sheet.png|
|sandwich-11|머쉬룸 멜트 샌드위치|/menu/sandwich-11|/images/product-details/sandwich-11/story-sheet.png|
|sandwich-12|터키 크랜베리 샌드위치|/menu/sandwich-12|/images/product-details/sandwich-12/story-sheet.png|
|sandwich-13|쉬림프 양배추 샌드위치|/menu/sandwich-13|/images/product-details/sandwich-13/story-sheet.png|
|sandwich-14|훈제연어 베이글 샌드위치|/menu/sandwich-14|/images/product-details/sandwich-14/story-sheet.png|
|sandwich-15|로스트비프 샌드위치|/menu/sandwich-15|/images/product-details/sandwich-15/story-sheet.png|
|sandwich-16|그릴드 채소 파니니|/menu/sandwich-16|/images/product-details/sandwich-16/story-sheet.png|
|cake-1|딸기 생크림 케이크|/menu/strawberry-cream-cake|/images/product-details/cake-1/story-sheet.png|
|cake-3|초콜릿 가나슈 케이크|/menu/chocolate-cake|/images/product-details/cake-3/story-sheet.png|
|cake-4|말차 크림 케이크|/menu/matcha-cake|/images/product-details/cake-4/story-sheet.png|
|cake-5|티라미수 케이크|/menu/tiramisu-cake|/images/product-details/cake-5/story-sheet.png|
|cake-6|레드벨벳 케이크|/menu/cake-6|/images/product-details/cake-6/story-sheet.png|
|cake-7|당근 케이크|/menu/cake-7|/images/product-details/cake-7/story-sheet.png|
|cake-8|블루베리 치즈케이크|/menu/blueberry-cheesecake|/images/product-details/cake-8/story-sheet.png|
|cake-9|레몬 요거트 케이크|/menu/cake-9|/images/product-details/cake-9/story-sheet.png|
|cake-10|복숭아 얼그레이 케이크|/menu/cake-10|/images/product-details/cake-10/story-sheet.png|
|cake-11|흑임자 크림 케이크|/menu/cake-11|/images/product-details/cake-11/story-sheet.png|
|cake-12|망고 코코넛 케이크|/menu/cake-12|/images/product-details/cake-12/story-sheet.png|
|cake-13|라즈베리 피스타치오 케이크|/menu/cake-13|/images/product-details/cake-13/story-sheet.png|
|cake-14|허니 카스텔라 케이크|/menu/cake-14|/images/product-details/cake-14/story-sheet.png|
|cake-15|밤 몽블랑 케이크|/menu/cake-15|/images/product-details/cake-15/story-sheet.png|
|cake-16|솔티드 카라멜 무스 케이크|/menu/cake-16|/images/product-details/cake-16/story-sheet.png|
|drink-1|아이스 아메리카노|/menu/drink-1|/images/product-details/drink-1/story-sheet.png|
|drink-2|아이스 카페라떼|/menu/drink-2|/images/product-details/drink-2/story-sheet.png|
|drink-3|아이스 바닐라 라떼|/menu/drink-3|/images/product-details/drink-3/story-sheet.png|
|drink-4|아이스 카라멜 마키아토|/menu/drink-4|/images/product-details/drink-4/story-sheet.png|
|drink-5|딸기 라떼|/menu/drink-5|/images/product-details/drink-5/story-sheet.png|
|drink-6|아이스 말차 라떼|/menu/drink-6|/images/product-details/drink-6/story-sheet.png|
|drink-7|레몬 에이드|/menu/drink-7|/images/product-details/drink-7/story-sheet.png|
|drink-8|복숭아 아이스티|/menu/drink-8|/images/product-details/drink-8/story-sheet.png|
|drink-9|콜드브루|/menu/drink-9|/images/product-details/drink-9/story-sheet.png|
|drink-10|허니 캐모마일 티|/menu/drink-10|/images/product-details/drink-10/story-sheet.png|
|drink-11|자몽 에이드|/menu/drink-11|/images/product-details/drink-11/story-sheet.png|
|drink-12|블루베리 요거트 스무디|/menu/drink-12|/images/product-details/drink-12/story-sheet.png|
|drink-13|흑임자 라떼|/menu/drink-13|/images/product-details/drink-13/story-sheet.png|
|drink-14|제주 청귤 티|/menu/drink-14|/images/product-details/drink-14/story-sheet.png|
|drink-15|코코넛 커피 쉐이크|/menu/drink-15|/images/product-details/drink-15/story-sheet.png|
|drink-16|라즈베리 히비스커스 티|/menu/drink-16|/images/product-details/drink-16/story-sheet.png|
|strawberry-shortcake|딸기 생크림 케이크|/menu/strawberry-cream-cake?option=best|/images/product-details/strawberry-shortcake/story-sheet.png|
|chocolate-cake|초콜릿 케이크|/menu/chocolate-cake?option=best|/images/product-details/chocolate-cake/story-sheet.png|
|matcha-cake|말차 케이크|/menu/matcha-cake?option=best|/images/product-details/matcha-cake/story-sheet.png|
|strawberry-roll-cake|딸기 롤케이크|/menu/strawberry-roll-cake|/images/product-details/strawberry-roll-cake/story-sheet.png|
|blueberry-cheesecake|블루베리 치즈 케이크|/menu/blueberry-cheesecake?option=home|/images/product-details/blueberry-cheesecake/story-sheet.png|
|tiramisu|티라미수|/menu/tiramisu-cake?option=home|/images/product-details/tiramisu/story-sheet.png|
|lemon-tart|레몬 타르트|/menu/lemon-tart|/images/product-details/lemon-tart/story-sheet.png|
|fruit-tart|생과일 타르트|/menu/fruit-tart|/images/product-details/fruit-tart/story-sheet.png|
|salted-caramel-financier|솔티드 카라멜 휘낭시에|/menu/salted-caramel-financier|/images/product-details/salted-caramel-financier/story-sheet.png|
|earl-grey-scone|얼그레이 스콘|/menu/earl-grey-scone|/images/product-details/earl-grey-scone/story-sheet.png|
|pistachio-cream-croissant|피스타치오 크림 크루아상|/menu/pistachio-cream-croissant|/images/product-details/pistachio-cream-croissant/story-sheet.png|
|peach-yogurt-mousse|복숭아 요거트 무스|/menu/peach-yogurt-mousse|/images/product-details/peach-yogurt-mousse/story-sheet.png|
|new-dubai-chocolate-croissant|두바이 초콜릿 크루아상|/new-menu/new-dubai-chocolate-croissant|/images/product-details/new-dubai-chocolate-croissant/story-sheet.png|
|new-strawberry-pistachio-bun|딸기 피스타치오 크림빵|/new-menu/new-strawberry-pistachio-bun|/images/product-details/new-strawberry-pistachio-bun/story-sheet.png|
|new-lemon-cream-danish|레몬 크림 데니시|/new-menu/new-lemon-cream-danish|/images/product-details/new-lemon-cream-danish/story-sheet.png|
|new-black-sesame-brioche|흑임자 크림 브리오슈|/new-menu/new-black-sesame-brioche|/images/product-details/new-black-sesame-brioche/story-sheet.png|
|new-earl-grey-fig-cake|얼그레이 무화과 케이크|/new-menu/new-earl-grey-fig-cake|/images/product-details/new-earl-grey-fig-cake/story-sheet.png|
|new-yuja-cheese-mousse|유자 치즈 무스 케이크|/new-menu/new-yuja-cheese-mousse|/images/product-details/new-yuja-cheese-mousse/story-sheet.png|
|new-chocolate-hazelnut-mousse|초코 헤이즐넛 무스 케이크|/new-menu/new-chocolate-hazelnut-mousse|/images/product-details/new-chocolate-hazelnut-mousse/story-sheet.png|
|new-berry-yogurt-mousse|베리 요거트 무스 케이크|/new-menu/new-berry-yogurt-mousse|/images/product-details/new-berry-yogurt-mousse/story-sheet.png|
|new-basil-chicken-focaccia|바질 치킨 포카치아 샌드위치|/new-menu/new-basil-chicken-focaccia|/images/product-details/new-basil-chicken-focaccia/story-sheet.png|
|new-jambon-beurre|잠봉뵈르 샌드위치|/new-menu/new-jambon-beurre|/images/product-details/new-jambon-beurre/story-sheet.png|
|new-strawberry-matcha-cream-latte|딸기 말차 크림 라떼|/new-menu/new-strawberry-matcha-cream-latte|/images/product-details/new-strawberry-matcha-cream-latte/story-sheet.png|
|new-salted-caramel-milk-tea|솔티드 카라멜 밀크티|/new-menu/new-salted-caramel-milk-tea|/images/product-details/new-salted-caramel-milk-tea/story-sheet.png|

## 실제 검증 결과
- 85개 대상 경로 × 1920/834/402px = 255건 검사 통과. 이미지 HTTP/MIME 검사, 상품 ID와 경로, 상세 장면16개, 추가 썸네일5칸, 가로 넘침, 잘못된 타 상품 이미지 연결 검사 통과.
- 모든84개 시트의 SHA-256 해시가 서로 다름.
- 84개 원본 시트의 개요와 빵/케이크/샌드위치/음료 실제 페이지 화면 확인.
- 빵/케이크/샌드위치/음료 추가 썸네일4개 클릭 시 같은 상품의 다른 장면 표시 확인.
- 소금빵/시나몬롤/불고기 샌드위치 JSX·CSS6개 해시 동일, 3개 화면 본문 HTML/크기/스타일을 세 너비에서 수정 전과 비교해 일치.
- 런타임 실행 예외 없음, npm build 통과. 기존 번들 크기 경고는 남아 있음.

## 이번 작업의 코드 변경 파일
- src/pages/BasqueCheesecakeDetail.jsx, src/pages/BasqueCheesecakeDetail.css
- src/components/ProductStoryBody.jsx, src/components/ProductStoryBody.css
- src/components/UnifiedProductDetail.jsx
- src/productDetailImages.js, src/productArtwork.js, src/productStoryContent.js
- src/productIllustrationSheets.json (신규 이미지 좌표/경로 등록)

새 이미지: public/images/product-details/<상품ID>/story-sheet.png 84개와 bread-2/signature.png. 원본 파일 비율과 PNG를 유지하고 SVG 영역 표시로 사용함. 다른 상품 파일로 대체하지 않음.

문서: product-detail-generated-images.csv(상품/용도/권장크기/배경/캐릭터/파일), generated-product-image-prompts.json(최종 프롬프트), 본 보고서. Git commit/push 없음.
