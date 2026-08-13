import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const LoginCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.25);
  padding: 48px 32px 32px 32px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;

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
  color: #333;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    margin-bottom: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #ff6699;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 0;
  background: #111;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #222;
  }

  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 0.95rem;
  }
`;

const SignupLink = styled.p`
  font-size: 1rem;
  color: #444;
  text-align: center;
  margin-bottom: 18px;

  a {
    color: #007aff;
    text-decoration: none;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
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

const API_URL = process.env.REACT_APP_API_URL;

const Login = () => {
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");

        // Remove any leftover Google JWT so it can't override this fresh session login
        localStorage.removeItem("moonflower_token");

        await refreshUser();   // wait so context has the logged-in user before we navigate

        navigate("/");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed! Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <>
      <GlobalStyle />

      <Container>
        <LoginCard>
          <Title>Login</Title>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <SubmitButton type="submit">
              Login
            </SubmitButton>
          </Form>

          <SignupLink>
            Don't have an account?
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Sign up here
            </a>
          </SignupLink>

          <Divider>
            <span>or</span>
          </Divider>

          <SocialButton
            type="button"
            onClick={handleGoogleLogin}
          >
            <FaGoogle />
            Continue with Google
          </SocialButton>
        </LoginCard>
      </Container>
    </>
  );
};

export default Login;