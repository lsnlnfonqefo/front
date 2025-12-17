# Allbirds Clone - 웹프로그래밍 텀프로젝트

올버즈(Allbirds) 쇼핑몰 클론 코딩 프로젝트입니다.

## 기술 스택

- **Frontend**: React (Vite)
- **Styling**: Styled-Components (순수 CSS, 프레임워크 미사용)
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **State Management**: React Context API

## 프로젝트 구조

```
src/
├── api/                    # API 함수 모듈
│   ├── axios.js           # Axios 인스턴스 설정
│   ├── auth.js            # 인증 관련 API
│   ├── products.js        # 상품 관련 API
│   ├── cart.js            # 장바구니 API
│   ├── orders.js          # 주문 API
│   ├── admin.js           # 관리자 API
│   └── index.js           # API 모듈 export
├── components/
│   ├── common/            # 공통 컴포넌트 (AuthGuard 등)
│   ├── layout/            # 레이아웃 컴포넌트 (Header, Footer)
│   ├── cart/              # 장바구니 컴포넌트
│   └── product/           # 상품 관련 컴포넌트
├── context/               # React Context
│   ├── AuthContext.jsx    # 인증 상태 관리
│   └── CartContext.jsx    # 장바구니 상태 관리
├── pages/                 # 페이지 컴포넌트
│   ├── MainPage.jsx       # 메인 (랜딩) 페이지
│   ├── ProductListPage.jsx # 상품 목록 페이지
│   ├── ProductDetailPage.jsx # 상품 상세 페이지
│   ├── LoginPage.jsx      # 로그인 페이지
│   ├── RegisterPage.jsx   # 회원가입 페이지
│   ├── MyPage.jsx         # 마이페이지
│   └── AdminPage.jsx      # 관리자 페이지
├── styles/
│   ├── GlobalStyle.js     # 전역 스타일 (Reset CSS 포함)
│   └── theme.js           # 테마 설정
├── App.jsx                # 메인 라우팅
└── main.jsx               # 엔트리 포인트
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일이 이미 포함되어 있습니다. 필요시 수정하세요:

```
VITE_API_BASE_URL=http://54.180.130.171
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

### 4. 프로덕션 빌드

```bash
npm run build
```

## 주요 기능

### 공통
- [x] 반응형 헤더 (hover 시 서브메뉴 표시)
- [x] 지속가능성 메뉴 hover 애니메이션
- [x] 푸터

### 메인 페이지
- [x] 히어로 이미지 슬라이더 (좌/우 버튼, 자동 슬라이딩)
- [x] 실시간 인기 상품 슬라이더 (1~5번 클릭 시 슬라이딩)

### 상품 목록 페이지
- [x] 카테고리별 필터링 (라이프스타일, 슬립온, 신제품, 세일)
- [x] 가용 사이즈 필터링
- [x] 소재 필터링 (Tree, Wool)
- [x] 정렬 (추천순, 판매순, 가격순, 최신순)
- [x] 적용된 필터 표시 및 개별/전체 해제

### 상품 상세 페이지
- [x] 이미지 갤러리 (썸네일 클릭 시 메인 이미지 변경)
- [x] 사이즈 선택
- [x] 수량 선택
- [x] 장바구니 담기
- [x] 아코디언 UI (제품 상세, 배송 정보, 관리 방법)
- [x] 리뷰 목록 표시

### 장바구니
- [x] 사이드바 형태로 표시
- [x] 수량 조절
- [x] 상품 삭제
- [x] 결제 버튼 → 주문 생성

### 마이페이지
- [x] 사용자 정보 표시
- [x] 지난 주문 내역 표시
- [x] 후기 작성 (별점 + 텍스트)

### 관리자 페이지
- [x] 상품 목록 관리
- [x] 가용 사이즈 변경
- [x] 할인 정책 변경 (할인율, 기간 설정)
- [x] 새 상품 등록 (이미지 포함)
- [x] 판매 현황 조회 (기간별 필터링)

## API 연동

세션 기반 인증을 사용합니다. Axios 인스턴스에 `withCredentials: true`가 설정되어 있어 쿠키가 자동으로 처리됩니다.

### 주요 엔드포인트

| 기능 | Method | Endpoint |
|------|--------|----------|
| 로그인 | POST | `/api/auth/login` |
| 로그아웃 | POST | `/api/auth/logout` |
| 세션 확인 | GET | `/api/auth/me` |
| 인기 상품 | GET | `/api/products/popular` |
| 상품 목록 | GET | `/api/products` |
| 상품 상세 | GET | `/api/products/:id` |
| 장바구니 조회 | GET | `/api/cart` |
| 장바구니 추가 | POST | `/api/cart/items` |
| 주문 생성 | POST | `/api/orders` |
| 주문 내역 | GET | `/api/orders` |
| 리뷰 조회 | GET | `/api/products/:id/reviews` |
| 리뷰 작성 | POST | `/api/products/:id/reviews` |
| 관리자 상품 | GET | `/api/admin/products` |
| 상품 등록 | POST | `/api/admin/products` |
| 매출 현황 | GET | `/api/admin/sales` |

## 라이센스

이 프로젝트는 교육 목적으로 제작되었습니다.
