import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaMicrosoft, FaApple, FaPhone } from "react-icons/fa";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  padding: 48px 32px 32px 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 32px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-bottom: 20px;
  outline: none;
`;

const ContinueButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 18px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #222;
  }
`;

const LoginLink = styled.div`
  font-size: 1rem;
  margin-bottom: 18px;
  color: #444;
  a {
    color: #007aff;
    text-decoration: none;
    margin-left: 4px;
    &:hover { text-decoration: underline; }
  }
`;

const Divider = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #eee;
  line-height: 0.1em;
  margin: 18px 0 18px 0;
  span {
    background: #fff;
    padding: 0 16px;
    color: #888;
    font-size: 0.95rem;
  }
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 12px 0;
  background: #f5f5f5;
  color: #222;
  border: 1px solid #eee;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #f0f0f0;
  }
`;

const Signup = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    // You can add your signup logic here
    alert("Continue with: " + email);
  };

  return (
    <Container>
      <Card>
        <Title>Create an account</Title>
        <form style={{ width: "100%" }} onSubmit={handleContinue}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <ContinueButton type="submit">Continue</ContinueButton>
        </form>
        <LoginLink>
          Already have an account?
          <a href="#" onClick={e => { e.preventDefault(); navigate("/login"); }}>Log in</a>
        </LoginLink>
        <Divider><span>or</span></Divider>
        <SocialButton><FaPhone /> Continue with phone</SocialButton>
        <SocialButton><FaGoogle /> Continue with Google</SocialButton>
        <SocialButton><FaMicrosoft /> Continue with Microsoft Account</SocialButton>
        <SocialButton><FaApple /> Continue with Apple</SocialButton>
      </Card>
    </Container>
  );
};

export default Signup;
