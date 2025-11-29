import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import "./Haeder.css";

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const AuthButton = styled.button`
  padding: 8px 16px;
  background: ${(props) => (props.primary ? "#000" : "white")};
  color: ${(props) => (props.primary ? "white" : "#000")};
  border: 1px solid #000;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.primary ? "#333" : "#f0f0f0")};
  }
`;

const CartButton = styled.button`
  position: relative;
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    border-color: #000;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
`;

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { getTotalQuantity, openCart } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/manList" className="logo">
          <h1>AllBirds</h1>
        </Link>

        <nav className="nav">
          <Link to="/manList">남성</Link>
          <Link to="/manList">여성</Link>
        </nav>

        <HeaderRight>
          {user ? (
            <>
              {user.name}님
              {isAdmin() && (
                <AuthButton onClick={() => navigate("/admin")}>
                  관리자
                </AuthButton>
              )}
              {!isAdmin() && (
                <>
                  <AuthButton onClick={() => navigate("/mypage")}>
                    마이페이지
                  </AuthButton>
                  <CartButton onClick={openCart}>
                    🛒
                    {getTotalQuantity() > 0 && (
                      <CartBadge>{getTotalQuantity()}</CartBadge>
                    )}
                  </CartButton>
                </>
              )}
              <AuthButton onClick={handleLogout}>로그아웃</AuthButton>
            </>
          ) : (
            <AuthButton primary onClick={() => navigate("/login")}>
              로그인
            </AuthButton>
          )}
        </HeaderRight>
      </div>
    </header>
  );
}
