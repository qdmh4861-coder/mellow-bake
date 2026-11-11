# GitHub Pages 경로 및 배포 오류 수정

점검일: 2026-11-11
대상: `qdmh4861-coder/mellow-bake`
배포 기준: `https://qdmh4861-coder.github.io/mellow-bake/`

## 적용한 방식

- Vite의 `base: '/mellow-bake/'`를 유지한다.
- 페이지 주소는 `/mellow-bake/#/login`, `/mellow-bake/#/cart`, `/mellow-bake/#/menu/cake-2`처럼 해시 라우팅으로 통일했다. 새 주소의 직접 접속과 새로고침은 서버에 `/mellow-bake/`만 요청한다.
- `src/appRouting.js`의 `appHref`, `assetHref`, `appLocation`, `appHistory`를 재사용한다. 논리 경로 `/cart`, 기존 접두 경로 `/mellow-bake/cart`, 이미 변환된 주소 모두 같은 주소가 된다. 접두 경로를 중복 추가하지 않는다.
- App, 로그인 보호, 헤더 활성화, 마이페이지 테마, 공지 상세와 각 화면의 쿼리 판별은 공통 논리 경로를 읽는다.
- 배송 조회의 기존 GET 폼도 제출 시 공통 경로로 이동하도록 수정했다. 브라우저가 해시 앞에 쿼리를 붙여 주문번호를 잃는 문제를 방지한다.
- 루트의 구독 컴포넌트가 해시 변경/뒤로 가기/앞으로 가기를 감지해 기존 App을 해당 페이지로 전환한다. 상품 옵션·리뷰 필터·문의 상세의 history 쿼리 변경도 해시 주소에 보존한다.
- 상세 탭 등 기존 `#section` 링크는 `/mellow-bake/#/menu/상품#section`으로 처리하며 해당 섹션으로 스크롤한다.
- `<a href>`와 프로그래밍 이동을 공통 처리했다. 외부 링크, 전화/메일 링크, 이미지 원본 보기, data/blob URL은 페이지 경로로 바꾸지 않는다.
- 이미지 및 SVG image URL은 `/mellow-bake/images/...` 또는 기존 Vite `/mellow-bake/assets/...`를 사용한다. 이미지 파일, 비율, CSS와 디자인은 변경하지 않았다.
- index.html의 파비콘 주소도 `%BASE_URL%`로 연결했다. 아이콘 파일 자체는 변경하지 않았다.

## 기존 일반 주소 복구

`scripts/githubPagesFallback.js`가 빌드에 `dist/404.html`을 생성한다. 예전에 공유한 `/mellow-bake/login`, `/mellow-bake/menu/cake-2?option=home#product-reviews` 등은 프로젝트 루트의 해시 주소로 복구한다. 쿼리와 섹션도 유지한다.

**제한:** 이전 일반 주소의 최초 요청은 GitHub Pages가 404 응답으로 이 파일을 제공한 뒤 리다이렉트한다. 서버 rewrite가 생기는 것은 아니다. 새 해시 주소는 처음부터 루트 문서를 요청하므로 정상 200 응답으로 새로고침된다. 저장소 경로 밖의 `https://qdmh4861-coder.github.io/login`은 이 프로젝트에서 복구할 수 없으므로 사용하지 않는다.

## 로그인 및 Actions

- 개발 StrictMode에서 보호 화면의 리다이렉트가 두 번 실행될 때 로그인 주소가 `next` 안에 중첩되던 문제를 수정했다. 렌더 당시 요청 경로를 고정해 동일한 복귀 주소를 유지한다.
- 로그인 후 복귀 주소는 같은 출처의 기존 보호 페이지만 허용한다. 기존 접두 경로와 해시 경로도 정규화한다. 외부 URL이나 잘못된 URL은 기존 마이페이지로 이동한다.
- Actions의 빌드 명령은 `npm run build`로 통일했다. CLI의 별도 base 중복 설정을 제거하고 `vite.config.js`를 사용한다.
- 빌드 후 `dist/index.html`, `dist/404.html` 존재 여부를 검사한다. 기존 artifact 업로드 및 Pages 배포 구조는 유지한다.
- 데모 로그인 빌드 변수는 다음 GitHub Actions Secrets에서 전달한다:
  - `VITE_DEMO_AUTH_SALT`
  - `VITE_DEMO_AUTH_VERIFIER`
- 이 두 값이 저장소에 실제 등록되어 있는지는 확인하지 못했다. 없으면 라우팅은 작동하지만 기존 로그인 화면에서 데모 비밀번호 설정 안내가 표시된다. 기존 `scripts/setup-demo-auth.mjs`의 데모 검증 설정과 일치하는 값을 등록해야 한다. 실제 비밀번호나 실제 API 키를 넣지 않는다. 이 프런트엔드 검증은 실서비스 서버 인증이 아니다.

## 실행한 테스트

| 검사 | 결과 |
| --- | --- |
| `npm run build` | 성공. 기존 500KB 초과 번들 경고는 남아 있다. |
| `npm run lint` | 종료 코드 0. 기존 경고는 남아 있다. |
| `npm run test:routing` | 7개 테스트 통과. 중복 접두 경로, 쿼리·해시, 이미지/외부 링크, assign/replace/history, 로그인 복귀와 404 생성 검사. |
| 정적 배포 결과물 | Vite SPA fallback 없이 dist 파일만 제공하는 로컬 서버에서 검사했다. 없는 파일은 실제 HTTP 404와 생성된 404.html을 반환하도록 구성했다. |
| 전체 경로 | 일반 33개 + 상품 상세 88개 = 121개 경로를 1920/834/402/360px에서 총 484회 검사. 잘못된 내부 링크·없는 이미지·브라우저 실행 예외·예상하지 않은 404 요청·가로 넘침 없음. |
| 상품 일치 | 상품 상세 방문 352회(88×4)에서 상품명과 실제 등록 상품을 비교했으며 불일치 없음. |
| 실제 클릭 | 네 화면 너비에서 HOME/MENU/ABOUT/STORE/NEW MENU/REVIEW 햄버거 이동·닫힘·새로고침 통과. 배송 조회 주문 선택·쿼리·새로고침, 회원가입 이동, 보호 화면 로그인 안내, 찜 담기 팝업→장바구니→상품 상세, 상세 탭과 같은 탭 재클릭 스크롤, 시연 주문 확인·새로고침, 리뷰 쿼리 필터·새로고침, 검색 결과 이동, 브라우저 뒤로/앞으로, 로그아웃 통과. |
| 기존 주소 | 로그인/바스크 상품 쿼리와 섹션/FAQ 3개 일반 주소의 404 복구를 확인했다. 이 3번의 최초 404는 복구 처리 검사용으로만 발생했다. |
| 데모 로그인 | 격리한 Vite 서버에서 임시 검증값과 일회성 테스트 비밀번호로 성공·실패, 장바구니→로그인→원래 시연 주문 확인, 기본 마이페이지, 외부/잘못된 복귀 주소 거부를 확인했다. 실제 비밀번호는 읽거나 출력하지 않았다. |

로컬 실행 기록은 `node_modules/.cache/wishlist-check/pages-*.log`, `pages-static-audit.json`에 있다. 테스트로 변경한 브라우저 저장 자료는 테스트 종료 시 복원했다. 본 작업에서 CSS, 이미지 파일, 상품 데이터, 텍스트와 레이아웃은 수정하지 않았다.

## 남아 있는 확인 사항

- 요청대로 push, 강제 push, GitHub Actions 실행, 실제 배포를 하지 않았다. 따라서 공개 배포 주소에서 이번 코드가 반영됐다는 확인은 하지 않았다.
- GitHub 저장소 Pages 소스가 GitHub Actions인지, 데모 로그인 Secrets가 등록됐는지는 저장소 설정에서 확인해야 한다.
- GitHub Pages의 실제 CDN 캐시, 실제 iOS/Android 기기는 테스트하지 않았다. 브라우저 검사는 Chrome의 지정 너비로 수행했다.
- 기존 서버 인증·실결제·AI 외부 API 등의 미연동 범위는 그대로다. 기능을 새로 구현하거나 데이터/화면을 변경하지 않았다.

## 수정한 파일

공통 경로 함수를 사용하도록 각 JSX의 링크/이미지 속성과 URL 읽기·쓰기만 변경했다. 아래 src 목록은 이 작업에서 변경한 파일이다.

### 공통 및 배포

- `src/appRouting.js` (추가)
- `src/components/RoutedApp.jsx` (추가)
- `src/main.jsx`
- `vite.config.js`
- `scripts/githubPagesFallback.js` (추가)
- `index.html`
- `.github/workflows/deploy.yml`
- `package.json`
- `tests/appRouting.test.js` (추가)
- `docs/github-pages-routing.md` (이 보고서)

### 페이지 및 컴포넌트의 경로 연결
- `src/App.jsx`
- `src/cartStore.js`
- `src/demoAuth.js`
- `src/orderPreview.js`
- `src/wishlistStore.js`
- `src/components/AboutFooter.jsx`
- `src/components/BenefitsBanner.jsx`
- `src/components/BestMenu.jsx`
- `src/components/CakeCornerArt.jsx`
- `src/components/CatalogProductImage.jsx`
- `src/components/Consultation.jsx`
- `src/components/DetailProductGallery.jsx`
- `src/components/FindYourSweet.jsx`
- `src/components/HomeFooter.jsx`
- `src/components/HomeHeader.jsx`
- `src/components/HomeHero.jsx`
- `src/components/MemberArtwork.jsx`
- `src/components/MemberBottomLayout.jsx`
- `src/components/MemberCutout.jsx`
- `src/components/MemberProductImage.jsx`
- `src/components/MemberTheme.jsx`
- `src/components/MyPageFooter.jsx`
- `src/components/MyPageSidebar.jsx`
- `src/components/NewArrivals.jsx`
- `src/components/NewMenu.jsx`
- `src/components/NewMenuProductImage.jsx`
- `src/components/OrderProductImage.jsx`
- `src/components/OurStory.jsx`
- `src/components/ProductDetailBody.jsx`
- `src/components/ProductDetailFooter.jsx`
- `src/components/ProductHeaderControls.jsx`
- `src/components/ProductHero.jsx`
- `src/components/ProductSearch.jsx`
- `src/components/ProductStoryBody.jsx`
- `src/components/ReviewMedia.jsx`
- `src/components/ReviewSuccessDialog.jsx`
- `src/components/SeasonalSpecial.jsx`
- `src/components/UnifiedProductDetail.jsx`
- `src/components/WishlistCartSuccess.jsx`
- `src/components/WishlistProductImage.jsx`
- `src/pages/About.jsx`
- `src/pages/BasqueCheesecakeDetail.jsx`
- `src/pages/BenefitOverview.jsx`
- `src/pages/BulgogiSandwichDetail.jsx`
- `src/pages/Cart.jsx`
- `src/pages/CinnamonRollDetail.jsx`
- `src/pages/CouponEvent.jsx`
- `src/pages/CouponWallet.jsx`
- `src/pages/Faq.jsx`
- `src/pages/Home.jsx`
- `src/pages/InquiryHistory.jsx`
- `src/pages/InquiryWrite.jsx`
- `src/pages/Login.jsx`
- `src/pages/MyPage.jsx`
- `src/pages/MyReviews.jsx`
- `src/pages/NewMenuDetail.jsx`
- `src/pages/NewMenuPage.jsx`
- `src/pages/Notices.jsx`
- `src/pages/OrderDetail.jsx`
- `src/pages/OrderHistory.jsx`
- `src/pages/OrderList.jsx`
- `src/pages/OurMenu.jsx`
- `src/pages/PasswordChange.jsx`
- `src/pages/PaymentHistory.jsx`
- `src/pages/PointsLedger.jsx`
- `src/pages/ProductDetail.jsx`
- `src/pages/Profile.jsx`
- `src/pages/PublicReviewCards.jsx`
- `src/pages/Reviews.jsx`
- `src/pages/ReviewWrite.jsx`
- `src/pages/SaltBreadDetail.jsx`
- `src/pages/Signup.jsx`
- `src/pages/Store.jsx`
- `src/pages/Wishlist.jsx`

## 공식 참고 문서

- [Vite 정적 배포와 GitHub Pages base 설정](https://vite.dev/guide/static-deploy)
- [GitHub Pages 커스텀 404 페이지](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
