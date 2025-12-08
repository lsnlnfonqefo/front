import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { user, logout, isAdmin } = useAuth();
  const { itemCount, toggleCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <HeaderWrapper>
      <NavContainer>
        <Logo to="/">allbirds</Logo>

        <NavMenu>
          {/* 남성 hover시 서브메뉴 */}
          <NavItem
            onMouseEnter={() => setActiveMenu("men")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <NavLink as="span">남성</NavLink>
            {activeMenu === "men" && (
              <FullWidthMegaMenu>
                <MegaMenuInner>
                  <MenuColumn>
                    <ColumnTitle>신제품</ColumnTitle>
                    <MenuItemWithBar to="/products?category=new">
                      크루저 미드 익스플로어
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=new">
                      코듀로이 슬립온
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=new">
                      울 크루저
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=new">
                      트리 러너 NZ
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=new">
                      울 크루저 슬립온
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=new">
                      울 러너 NZ
                    </MenuItemWithBar>
                  </MenuColumn>
                  <MenuColumn>
                    <ColumnTitle>남성 신발</ColumnTitle>
                    <MenuItemWithBar to="/products">전체</MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=new">
                      가을 컬렉션
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=lifestyle">
                      라이프스타일
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products">액티브</MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=slipon">
                      슬립온
                    </MenuItemWithBar>
                    <MenuItemWithBar to="/products?category=sale">
                      세일
                    </MenuItemWithBar>
                  </MenuColumn>
                  <MenuColumn>
                    <ColumnTitle>의류 & 악세사리</ColumnTitle>
                    <MenuItemWithBar to="#">양말</MenuItemWithBar>
                    <MenuItemWithBar to="#">의류</MenuItemWithBar>
                    <MenuItemWithBar to="#">악세사리</MenuItemWithBar>
                  </MenuColumn>
                </MegaMenuInner>
              </FullWidthMegaMenu>
            )}
          </NavItem>

          {/* 지속 가능성 hover시 서브메뉴 */}
          <NavItem
            onMouseEnter={() => setActiveMenu("sustainability")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <NavLink as="span">지속 가능성</NavLink>
            {activeMenu === "sustainability" && (
              <FullWidthMegaMenu>
                <MegaMenuInner>
                  <MenuColumn>
                    <ColumnTitle>올버즈</ColumnTitle>
                    <MenuItemWithBar to="#">브랜드 스토리</MenuItemWithBar>
                    <MenuItemWithBar to="#">지속 가능성</MenuItemWithBar>
                    <MenuItemWithBar to="#">소재</MenuItemWithBar>
                    <MenuItemWithBar to="#">수선</MenuItemWithBar>
                  </MenuColumn>
                  <MenuColumn>
                    <ColumnTitle>스토리</ColumnTitle>
                    <MenuItemWithBar to="#">M0.0NSHOT</MenuItemWithBar>
                    <MenuItemWithBar to="#">올멤버스</MenuItemWithBar>
                    <MenuItemWithBar to="#">올버즈 앰배서더</MenuItemWithBar>
                    <MenuItemWithBar to="#">ReRun</MenuItemWithBar>
                    <MenuItemWithBar to="#">신발 관리 방법</MenuItemWithBar>
                  </MenuColumn>
                  <MenuColumn>
                    <ColumnTitle>소식</ColumnTitle>
                    <MenuItemWithBar to="#">캠페인</MenuItemWithBar>
                    <MenuItemWithBar to="#">뉴스</MenuItemWithBar>
                  </MenuColumn>
                </MegaMenuInner>
              </FullWidthMegaMenu>
            )}
          </NavItem>
        </NavMenu>

        <RightSection>
          {user ? (
            <>
              <UserName>안녕하세요, {user.name}님</UserName>
              {isAdmin && (
                <HeaderButton as={Link} to="/admin">
                  관리자
                </HeaderButton>
              )}
              <HeaderButton as={Link} to="/mypage">
                마이페이지
              </HeaderButton>
              <HeaderButton onClick={handleLogout}>로그아웃</HeaderButton>
            </>
          ) : (
            <HeaderButton as={Link} to="/login">
              로그인
            </HeaderButton>
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
  border-bottom: 1px solid #e0e0e0;
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  height: 60px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-family: "Georgia", serif;
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

/* 전체 너비 메가메뉴 */
const FullWidthMegaMenu = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const MegaMenuInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  gap: 120px;
  padding: 40px 60px;
`;

const MenuColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 150px;
  opacity: 0;
  transform: translateX(-30px);
  animation: slideIn 0.5s ease forwards;

  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.15s;
  }
  &:nth-child(3) {
    animation-delay: 0.3s;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const ColumnTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 16px;
`;

/* 왼쪽 세로 바가 있는 메뉴 아이템 */
const MenuItemWithBar = styled(Link)`
  font-size: 14px;
  color: #757575;
  padding: 6px 0 6px 12px;
  border-left: 2px solid #e0e0e0;
  transition: all 0.2s;
  display: block;

  &:hover {
    color: #212121;
    border-left-color: #212121;
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
