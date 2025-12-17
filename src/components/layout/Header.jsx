import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

/* [NEW] 로고 이미지 불러오기 (같은 폴더에 'ㄴㄴ.jpg' 파일이 있어야 합니다) */
import logoImg from "./ㄴㄴ.jpg";

// SVG 아이콘 컴포넌트
const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CartIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { user } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    if (user) {
      navigate("/mypage");
    } else {
      navigate("/login");
    }
  };

  return (
    <HeaderWrapper>
      {/* 상단 프로모션 배너 */}
      <PromoBanner>
        <PromoText>BRAND DAY | 온라인 단독 30% (코드: BRAND30)</PromoText>
      </PromoBanner>

      {/* 메인 헤더 */}
      <MainHeader>
        <NavContainer>
          {/* [MODIFIED] 텍스트 대신 이미지 로고 사용 */}
          <LogoLink to="/">
            <img src={logoImg} alt="allbirds logo" />
          </LogoLink>

          <CenterNavMenu>
            {/* 남성 */}
            <NavItem>
              <NavLink to="/products?gender=men">남성</NavLink>
            </NavItem>

            {/* 여성 */}
            <NavItem>
              <NavLink to="/products?gender=women">여성</NavLink>
            </NavItem>

            {/* 매장 위치 */}
            <NavItem>
              <NavLink to="/stores">매장 위치</NavLink>
            </NavItem>

            {/* 지속 가능성 hover시 서브메뉴 */}
            <NavItem
              onMouseEnter={() => setActiveMenu("sustainability")}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <NavLink as="span">지속 가능성</NavLink>
              {activeMenu === "sustainability" && (
                <DropdownMenu>
                  <DropdownInner>
                    {/* 첫 번째 컬럼 */}
                    <MenuColumn>
                      <ColumnTitle>올버즈</ColumnTitle>
                      {/* MenuList로 감싸서 세로선 연결 */}
                      <MenuList>
                        <MenuItem to="#">브랜드 스토리</MenuItem>
                        <MenuItem to="#">지속 가능성</MenuItem>
                        <MenuItem to="#">소재</MenuItem>
                        <MenuItem to="#">수선</MenuItem>
                      </MenuList>
                    </MenuColumn>

                    {/* 두 번째 컬럼 */}
                    <MenuColumn>
                      <ColumnTitle>스토리</ColumnTitle>
                      {/* MenuList로 감싸서 세로선 연결 */}
                      <MenuList>
                        <MenuItem to="#">M0.0NSHOT</MenuItem>
                        <MenuItem to="#">올멤버스</MenuItem>
                        <MenuItem to="#">올버즈 앰배서더</MenuItem>
                        <MenuItem to="#">ReRun</MenuItem>
                        <MenuItem to="#">신발 관리 방법</MenuItem>
                      </MenuList>
                    </MenuColumn>
                  </DropdownInner>
                </DropdownMenu>
              )}
            </NavItem>
          </CenterNavMenu>

          <RightSection>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <IconButton onClick={handleUserIconClick}>
              <UserIcon />
            </IconButton>
            <IconButton onClick={toggleCart}>
              <CartIcon />
              {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
            </IconButton>
          </RightSection>
        </NavContainer>
      </MainHeader>
    </HeaderWrapper>
  );
};

export default Header;

// --- Styled Components ---

const HeaderWrapper = styled.header`
  --announcement-height: 40px;
  --header-height: 68px;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  width: 100%;
`;

const PromoBanner = styled.div`
  background: #000;
  height: var(--announcement-height);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PromoText = styled.span`
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const MainHeader = styled.div`
  position: relative;
  border-bottom: 1px solid #e0e0e0;
  overflow: visible;
`;

const NavContainer = styled.nav`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: var(--header-height);
`;

/* [MODIFIED] 텍스트 스타일(Logo)을 이미지 감싸는 링크 스타일(LogoLink)로 변경 */
const LogoLink = styled(Link)`
  display: flex; /* 이미지 수직 중앙 정렬 */
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;

  /* 이미지 크기 조절 (필요에 따라 height 값 조절하세요) */
  img {
    height: 52px; /* 예: 32px 높이로 설정 */
    width: auto; /* 비율 유지 */
    object-fit: contain;
  }
`;

const CenterNavMenu = styled.ul`
  display: flex;
  gap: 28px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #212121;
  padding: 18px 0;
  cursor: pointer;
  display: block;
  text-decoration: none;

  &:hover {
    color: #757575;
  }
`;

/* 전체 너비 드롭다운 메뉴 - 지속가능성 전용 */
const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: -100px;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  z-index: 999;
  box-sizing: border-box;
`;

const DropdownInner = styled.div`
  display: flex;
  gap: 80px;
  padding: 40px 80px;
  margin: 0;
`;

const MenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  /* gap 제거: 내부 MenuList에서 처리 */
  min-width: 120px;
  opacity: 0;
  transform: translateX(-30px);
  animation: slideIn 0.4s ease forwards;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.1s;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ColumnTitle = styled.h3`
  font-size: 32px;
  font-weight: 400;
  color: #212121;
  margin-bottom: 16px;
  position: relative;
  padding-left: 0;
  transition: padding-left 0.25s ease;
  cursor: default;

  &::before {
    content: "—";
    position: absolute;
    left: -32px;
    opacity: 0;
    transition: opacity 0.25s ease, left 0.25s ease;
    font-size: 32px;
  }

  &:hover {
    padding-left: 32px;

    &::before {
      opacity: 1;
      left: 0;
    }
  }
`;

/* [NEW] 세로선을 끊어지지 않게 만드는 래퍼 컴포넌트 */
const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid #000; /* 여기에 연결된 선 적용 */
  padding: 4px 0; /* 선 위아래 여백 */
  align-items: flex-start; /* 내부 아이템 좌측 정렬 */
`;

/* [MODIFIED] border-left 제거 및 좌측 정렬 강화 */
const MenuItem = styled(Link)`
  font-size: 16px;
  color: #757575;
  padding: 8px 0 8px 16px; /* 왼쪽 패딩으로 선과의 간격 유지 */
  transition: all 0.2s ease;
  display: block;
  text-decoration: none;

  /* 텍스트 좌측 정렬 */
  text-align: left;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    color: #212121;
    text-decoration: underline;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconButton = styled.button`
  position: relative;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212121;
  background: none;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.6;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  background: #212121;
  color: #fff;
  font-size: 9px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
