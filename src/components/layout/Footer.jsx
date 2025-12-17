import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <FooterWrapper>
      <FooterContent>
        <FooterSection>
          <FooterTitle>도움말</FooterTitle>
          <FooterLink to="#">배송 안내</FooterLink>
          <FooterLink to="#">반품 및 교환</FooterLink>
          <FooterLink to="#">FAQ</FooterLink>
          <FooterLink to="#">문의하기</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>회사 소개</FooterTitle>
          <FooterLink to="#">올버즈 스토리</FooterLink>
          <FooterLink to="#">지속 가능성</FooterLink>
          <FooterLink to="#">매장 찾기</FooterLink>
          <FooterLink to="#">채용</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>팔로우</FooterTitle>
          <FooterLink to="#">Instagram</FooterLink>
          <FooterLink to="#">Facebook</FooterLink>
          <FooterLink to="#">Twitter</FooterLink>
          <FooterLink to="#">YouTube</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>뉴스레터 구독</FooterTitle>
          <NewsletterText>
            올버즈의 최신 소식과 특별한 혜택을 받아보세요.
          </NewsletterText>
          <NewsletterForm>
            <NewsletterInput type="email" placeholder="이메일 주소" />
            <NewsletterButton>구독</NewsletterButton>
          </NewsletterForm>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <Copyright>
          © 2025 Allbirds Clone. 웹프로그래밍 텀프로젝트
        </Copyright>
        <LegalLinks>
          <LegalLink to="#">이용약관</LegalLink>
          <LegalLink to="#">개인정보처리방침</LegalLink>
        </LegalLinks>
      </FooterBottom>
    </FooterWrapper>
  );
};

export default Footer;

const FooterWrapper = styled.footer`
  background: #212121;
  color: #fff;
  padding: 60px 40px 30px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FooterTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const FooterLink = styled(Link)`
  font-size: 14px;
  color: #bdbdbd;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const NewsletterText = styled.p`
  font-size: 14px;
  color: #bdbdbd;
  line-height: 1.6;
`;

const NewsletterForm = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #424242;
  background: transparent;
  color: #fff;
  font-size: 14px;
  border-radius: 4px;

  &::placeholder {
    color: #757575;
  }

  &:focus {
    outline: none;
    border-color: #fff;
  }
`;

const NewsletterButton = styled.button`
  padding: 12px 24px;
  background: #fff;
  color: #212121;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #424242;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const Copyright = styled.p`
  font-size: 12px;
  color: #757575;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const LegalLink = styled(Link)`
  font-size: 12px;
  color: #757575;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;
