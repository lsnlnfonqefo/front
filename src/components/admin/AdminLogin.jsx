// 관리자 로그인 화면
import React, { useState } from 'react';
import styled from 'styled-components';
import { adminLogin } from '../../api/adminApi';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginBox = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  margin: 0 0 30px 0;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #fcc;
  font-size: 14px;
`;

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    console.log('📝 Form Submit:', {
      username,
      passwordLength: password.length,
      passwordType: typeof password,
    });

    try {
      // 서버가 email을 기대할 수도 있으므로, username이 email 형식이면 email로도 시도
      const credentials = { 
        username, 
        password: String(password) // 명시적으로 문자열로 변환
      };
      
      // username이 @를 포함하면 email 필드도 추가
      if (username.includes('@')) {
        credentials.email = username;
      }

      console.log('📤 Sending credentials:', {
        ...credentials,
        password: '***'
      });

      const response = await adminLogin(credentials);
      
      console.log('📥 Login Response:', response);
      console.log('📥 Login Response Data:', JSON.stringify(response, null, 2));
      console.log('📥 Login Response Data.data:', response.data);
      
      if (response.success) {
        console.log('✅ Login successful, redirecting...');
        // 응답 데이터에 토큰이나 세션 정보가 있는지 확인
        if (response.data) {
          console.log('📦 Response data contains:', Object.keys(response.data));
        }
        onLoginSuccess();
      } else {
        const errorMsg = response.message || '로그인에 실패했습니다.';
        console.error('❌ Login failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('❌ Login Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        fullError: err,
      });
      
      const errorMsg = err.response?.data?.message || err.message || '로그인에 실패했습니다.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginBox>
        <Title>관리자 로그인</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>아이디</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </Form>
      </LoginBox>
    </Container>
  );
};

export default AdminLogin;

