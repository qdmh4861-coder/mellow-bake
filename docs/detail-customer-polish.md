# 상품 상세 배경 및 고객 설명 수정

## 범위
완성된 소금빵·시나몬롤·불고기 샌드위치 제외, 85개 상세 경로. 상품별 기존 이미지 파일과 상품ID/경로 유지.

## 이미지
- 상세 본문의16개 이미지 프레임: 별도 크림 사각 배경/테두리를 투명하게 하고 기존 PNG의 밝은 바탕을 상세 전용 밝기/혼합으로 섹션 색상에 연결.
- 그림의 원본 비율, SVG 장면 좌표 및 클립 유지. 캐릭터나 음식을 자르거나 확대하지 않음.
- 추가 썸네일의 생성 이미지에도 상세 전용 혼합 적용. 정상 대표 이미지와 원본 파일은 유지.
- 바스크 본문 일러스트에는 같은 혼합과 가장자리2%의 부드러운 마스크를 적용. 원본 소개 배너 public/images/주석 2026-11-11 114841.png는 필터/마스크 없이 그대로 유지.
- 섹션 배경 자체는 기존 핑크/크림/화이트를 유지.
- PNG에 실제 알파 채널을 추가한 작업은 아님. 원본의 합쳐진 배경색은 파일 안에 그대로 있고 웹 표시만 비파괴 보정. 새 이미지 제작/원본 교체/삭제 없음.
- 현재 웹 표시 수정에 추가 이미지가 필수인 위치는 없음. 실제 투명 PNG 원본이 별도로 필요한 경우의 권장 경로는 detail-background-assets.csv에 기재. 해당 파일은 현재 요청하거나 자동 연결한 파일이 아님.

## 문구
- productCustomerContent.js로 상세 전용 문구를 분리. REVIEW에서 쓰는 productStoryContent.js/reviewExamples.js는 변경하지 않음.
- 02/03/05/06 재료·제작·매력 영역의 개발자용 표현 삭제. 맛과 향, 식감, 즐기는 장면을 설명.
- 확인된 레시피가 없으므로 03은 제조 수치나 공정을 단정하지 않는 ‘맛을 이루는 순간’으로 구성.
- 원재료 함량/알레르기/영양/보관/배송에 확인되지 않은 사실을 만들지 않고 상품 표시사항과 구매 전 안내를 확인하도록 고객용 문구로 정리.
- 예시 리뷰의 실제 구매 후기 아님 표시는 유지. 결제 미연결 안내 등 기존 기능상의 사실도 유지.

## 코드 파일
- src/productCustomerContent.js (신규)
- src/components/ProductStoryBody.jsx / ProductStoryBody.css
- src/components/UnifiedProductDetail.jsx / UnifiedProductDetail.css
- src/pages/BasqueCheesecakeDetail.jsx / BasqueCheesecakeDetail.css

## 검증
85개 경로 × 1920/834/402px = 255건 검사 통과.
- 임시 문구 제거, 이미지 HTTP 응답, 프레임 배경 투명/혼합, 기존 핑크/크림 섹션색 유지, 가로 넘침 없음 확인.
- 몽블랑/바스크/케이크/음료 실제 화면 확인.
- REVIEW 예시332개 본문/ID가 수정 전과 동일함을 확인.
- 이미지 파일과 상품 정보, 기존 라우팅 수정 없음.

## 대상 목록
|상품ID|상품명|기존 경로|
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
|cake-2|바스크 치즈 케이크|/menu/cake-2|
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

추가 확인: 보호 상세3개 본문 HTML/크기/스타일 수정 전 비교 통과. 빵·케이크·샌드위치·음료 추가 썸네일4개 클릭 동작 통과. npm build 통과, 수정 코드의 lint 경고 없음. Git commit/push 없음.
