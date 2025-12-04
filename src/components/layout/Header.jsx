import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <HeaderWrapper>
      {/* 상단 바 */}
      <TopBar>
        <span>COMFY, LOW-KEY LUXURY | 남성 영상</span>
      </TopBar>

      <NavContainer>
        <Logo to="/">allbirds</Logo>

        <NavMenu>
          {/* PPT slide3: 남성 hover시 서브메뉴 */}
          <NavItem
            onMouseEnter={() => setActiveMenu('men')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <NavLink as="span">남성</NavLink>
            {activeMenu === 'men' && (
              <MegaMenu>
                <MenuColumn>
                  <ColumnTitle>신제품</ColumnTitle>
                  <MenuItem to="/products?category=new">크루저 미드 익스플로어</MenuItem>
                  <MenuItem to="/products?category=new">코듀로이 슬립온</MenuItem>
                  <MenuItem to="/products?category=new">울 크루저</MenuItem>
                  <MenuItem to="/products?category=new">트리 러너 NZ</MenuItem>
                  <MenuItem to="/products?category=new">울 크루저 슬립온</MenuItem>
                  <MenuItem to="/products?category=new">울 러너 NZ</MenuItem>
                </MenuColumn>
                <MenuColumn>
                  <ColumnTitle>남성 신발</ColumnTitle>
                  <MenuItem to="/products">전체</MenuItem>
                  <MenuItem to="/products?category=new">가을 컬렉션</MenuItem>
                  <MenuItem to="/products?category=lifestyle">라이프스타일</MenuItem>
                  <MenuItem to="/products">액티브</MenuItem>
                  <MenuItem to="/products?category=slipon">슬립온</MenuItem>
                  <MenuItem to="/products?category=sale">세일</MenuItem>
                </MenuColumn>
                <MenuColumn>
                  <ColumnTitle>의류 & 악세사리</ColumnTitle>
                  <MenuItem to="#">양말</MenuItem>
                  <MenuItem to="#">의류</MenuItem>
                  <MenuItem to="#">악세사리</MenuItem>
                </MenuColumn>
              </MegaMenu>
            )}
          </NavItem>

          {/* PPT slide4: 지속 가능성 hover시 서브메뉴 + 애니메이션 */}
          <NavItem
            onMouseEnter={() => setActiveMenu('sustainability')}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <NavLink as="span">지속 가능성</NavLink>
            {activeMenu === 'sustainability' && (
              <MegaMenu>
                <MenuColumn>
                  <ColumnTitle>올버즈</ColumnTitle>
                  {/* PPT: 올버즈, 스토리, 소식 hover시 오른쪽으로 이동 애니메이션 */}
                  <AnimatedMenuItem to="#">브랜드 스토리</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">지속 가능성</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">소재</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">수선</AnimatedMenuItem>
                </MenuColumn>
                <MenuColumn>
                  <ColumnTitle>스토리</ColumnTitle>
                  <AnimatedMenuItem to="#">올앰버스</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">올버즈 앰배서더</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">ReRun</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">신발 관리 방법</AnimatedMenuItem>
                </MenuColumn>
                <MenuColumn>
                  <ColumnTitle>소식</ColumnTitle>
                  <AnimatedMenuItem to="#">캠페인</AnimatedMenuItem>
                  <AnimatedMenuItem to="#">뉴스</AnimatedMenuItem>
                </MenuColumn>
              </MegaMenu>
            )}
          </NavItem>
        </NavMenu>

        <RightSection>
          {user ? (
            <>
              <UserName>안녕하세요, {user.name}님</UserName>
              {isAdmin && <HeaderButton as={Link} to="/admin">관리자</HeaderButton>}
              <HeaderButton as={Link} to="/mypage">마이페이지</HeaderButton>
              <HeaderButton onClick={handleLogout}>로그아웃</HeaderButton>
            </>
          ) : (
            <HeaderButton as={Link} to="/login">로그인</HeaderButton>
          )}
          <CartButton onClick={toggleCart}>
            🛒
            {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
          </CartButton>
        </RightSection>
      </NavContainer>
    </HeaderWrapper>
  );
};

export default Header;

const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
`;

const TopBar = styled.div`
  background: #212121;
  color: #fff;
  text-align: center;
  padding: 8px;
  font-size: 12px;
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled(Link)`
  font-family: 'Georgia', serif;
  font-size: 24px;
  font-style: italic;
  color: #212121;
`;

const NavMenu = styled.ul`
  display: flex;
  gap: 32px;
`;

const NavItem = styled.li`
  position: relative;
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #212121;
  padding: 20px 0;
  cursor: pointer;

  &:hover {
    color: #757575;
  }
`;

/* PPT: 메가 메뉴 - 3열 구조 */
const MegaMenu = styled.div`
  position: absolute;
  top: 100%;
  left: -100px;
  background: #fff;
  display: flex;
  gap: 48px;
  padding: 32px 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #e0e0e0;
  min-width: 500px;
`;

const MenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ColumnTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 8px;
`;

const MenuItem = styled(Link)`
  font-size: 13px;
  color: #757575;
  transition: color 0.2s;

  &:hover {
    color: #212121;
  }
`;

/* PPT slide4: hover시 오른쪽으로 이동 애니메이션 */
const AnimatedMenuItem = styled(Link)`
  font-size: 13px;
  color: #757575;
  transition: all 0.3s ease;
  display: inline-block;

  &:hover {
    color: #2E7D32;
    transform: translateX(8px);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserName = styled.span`
  font-size: 13px;
  color: #757575;
`;

const HeaderButton = styled.button`
  font-size: 13px;
  color: #212121;
  padding: 8px 12px;
  border-radius: 4px;

  &:hover {
    background: #f5f5f5;
  }
`;

const CartButton = styled.button`
  position: relative;
  font-size: 20px;
  padding: 8px;
`;

const CartBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background: #212121;
  color: #fff;
  font-size: 10px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
