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
    overflow-x: hidden;
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
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
  background: white;
  
  @media (max-width: 768px) {
    padding: 32px 24px 24px 24px;
    max-width: 350px;
  }
  
  @media (max-width: 480px) {
    padding: 24px 16px 16px 16px;
    max-width: 100%;
    border-radius: 16px;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-bottom: 20px;
  outline: none;
  
  &:focus {
    border-color: #ff6699;
  }
  
  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    margin-bottom: 16px;
  }
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
  
  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 1rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 0.95rem;
    margin-bottom: 14px;
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
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 14px;
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
  
  @media (max-width: 768px) {
    margin: 16px 0 16px 0;
    
    span {
      padding: 0 12px;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    margin: 14px 0 14px 0;
    
    span {
      padding: 0 10px;
      font-size: 0.85rem;
    }
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
  
  @media (max-width: 768px) {
    padding: 10px 0;
    font-size: 0.95rem;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 0;
    font-size: 0.9rem;
    gap: 8px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSuccess("Account created successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google?returnTo=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Title>Create an account</Title>
          
          <form style={{ width: "100%" }} onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <ContinueButton type="submit">Create Account</ContinueButton>
          </form>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}
          
          <LoginLink>
            Already have an account?
            <a href="#" onClick={e => { e.preventDefault(); navigate("/login"); }}>Log in</a>
          </LoginLink>
          <Divider><span>or</span></Divider>
          <SocialButton onClick={handleGoogleSignup}>
            <FaGoogle /> Sign up with Google
          </SocialButton>
        </Card>
      </Container>
    </>
  );
};

export default Signup;
