# 상세 이미지 연결 점검

이미지 파일 238개를 public 및 src/assets에서 검색했습니다.

- 바스크 본문: public/images/바스크치즈.png의 시그니처·특징·재료·제작 과정·즐기는 방법·매력·원재료 일러스트 영역 연결.
- 바스크 구매 갤러리: public/images/Frame 930.png의 해당 상품 대표/썸네일 영역 유지.
- public/images/바스크.png는 이전 전체 시안이며 새 본문에 반복 적용하지 않습니다.
- 새 바스크 시안의 보관 안내 이미지 3칸과 리뷰 사진 4칸은 비어 있습니다. 실제 리뷰 첨부 사진만 표시하며 상품 이미지를 후기 사진으로 재사용하지 않습니다.
- 다른 상품 전용 product-details 폴더는 현재 없습니다. 기존 카드 원본은 대표 상품 표시용이며 제작 과정·재료 사진으로 재사용하지 않았습니다.
- 파일명이 상품·용도를 증명하지 않는 이미지나 타 상품 장식은 임의로 연결하지 않았습니다.

## 파일 준비 위치

상품별 정확한 이름/용도/크기/경로는 product-story-image-requirements.csv 참조(84개 상품 × 13개 용도 = 1,092개). 갤러리 추가 이미지 요청은 product-detail-missing-images.csv 참조.

public/images/product-details/<상품ID>/<용도>.png 또는 src/assets/product-details/<상품ID>/<용도>.png 지원. png/jpg/jpeg/webp/avif 및 대문자 확장자 지원. 동일 상품ID·용도만 검색합니다. 파일 추가 후 개발 서버 새로고침 또는 빌드가 필요합니다.

바스크 보관 이미지 추가 준비 경로:
- public/images/product-details/cake-2/storage-1.png (640×480)
- public/images/product-details/cake-2/storage-2.png (640×480)
- public/images/product-details/cake-2/storage-3.png (640×480)
현재 파일이 없어 연결하지 않았습니다. 리뷰 사진은 가상 파일이 아니라 리뷰 데이터의 photos에 실제 첨부해야 합니다.

보호 상세페이지 3개 및 HOME/MENU 카드 이미지 원본 수정 없음.

## 브라우저 검증

바스크·고구마 크림빵·초코 케이크·샌드위치·음료의 기존 상세 경로 5개에서 이미지 URL의 응답 및 이미지 MIME 형식, 상품별 준비 상태, 가로 넘침, 리뷰 대체 이미지 없음 검사 통과. 바스크 제작 과정 실제 화면 확인. 실행 예외 없음. npm build 통과(기존 번들 크기 경고).
