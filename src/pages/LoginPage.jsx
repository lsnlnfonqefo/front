import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <LoginContainer>
        <Title>로그인</Title>
        <Subtitle>올버즈에 오신 것을 환영합니다</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>이메일</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </SubmitButton>
        </Form>

        <TestAccountInfo>
          <p>테스트 계정:</p>
          <p>일반 사용자: user@test.com / 1234</p>
          <p>관리자: admin@test.com / 1234</p>
        </TestAccountInfo>
      </LoginContainer>
    </PageWrapper>
  );
};

export default LoginPage;

const PageWrapper = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f5f5f5;
`;

const LoginContainer = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 48px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #757575;
  text-align: center;
  margin-bottom: 32px;
`;

const ErrorMessage = styled.div`
  padding: 12px 16px;
  background: #ffebee;
  color: #c62828;
  font-size: 14px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #212121;
  }

  &::placeholder {
    color: #bdbdbd;
  }
`;

const SubmitButton = styled.button`
  padding: 16px;
  background: #212121;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 8px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: #424242;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const TestAccountInfo = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 13px;
  color: #757575;
  
  p {
    margin: 4px 0;
  }
`;
