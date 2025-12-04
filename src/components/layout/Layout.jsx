import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';

const Layout = ({ children }) => {
  return (
    <LayoutWrapper>
      <Header />
      <Main>{children}</Main>
      <Footer />
      <CartSidebar />
    </LayoutWrapper>
  );
};

export default Layout;

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;
