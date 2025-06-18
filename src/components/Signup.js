import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background: linear-gradient(to bottom, #F8A6D8, #FF7BAF);
    min-height: 100vh;
    overflow: hidden;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.25);
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
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.status === 404 && data.message && data.message.includes('User is not registered')) {
        window.alert('User is not registered. Please sign up first.');
        navigate('/signup');
        return;
      }
      if (!response.ok) {
        setError(data.message || "Failed to send OTP");
        return;
      }
      setOtpSent(true);
      setSuccess("OTP sent to your email!");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setVerifying(true);
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Failed to verify OTP");
        setVerifying(false);
        return;
      }
      setSuccess("Email verified successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    }
    setVerifying(false);
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Title>Create an account</Title>
          {!otpSent ? (
            <form style={{ width: "100%" }} onSubmit={handleSendOtp}>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <ContinueButton type="submit">Continue</ContinueButton>
            </form>
          ) : (
            <form style={{ width: "100%" }} onSubmit={handleVerifyOtp}>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
              />
              <ContinueButton type="submit" disabled={verifying}>{verifying ? "Verifying..." : "Verify OTP"}</ContinueButton>
            </form>
          )}
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
          <LoginLink>
            Already have an account?
            <a href="#" onClick={e => { e.preventDefault(); navigate("/login"); }}>Log in</a>
          </LoginLink>
          <Divider><span>or</span></Divider>
          <SocialButton onClick={() => window.location.href = 'http://localhost:8000/api/auth/google'}>
            <FaGoogle /> Continue with Google
          </SocialButton>
        </Card>
      </Container>
    </>
  );
};

export default Signup;
