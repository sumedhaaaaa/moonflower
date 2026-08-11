import React, { useState, useEffect } from "react";
import styled from "styled-components";

// const GreetingContainer = styled.div`
//   background-color: white;
//   padding: 12px 16px;
//   border-radius: 8px;
//   box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
//   font-size: 18px;
//   font-weight: bold;
//   color: black;
//   width: fit-content;
//   position: ${props => props.embedded ? 'relative' : 'absolute'};
//   top: ${props => props.embedded ? 'auto' : '20px'};
//   left: ${props => props.embedded ? 'auto' : '120px'}; /* Moves it further from the sidebar */
//   z-index: 1001;
//   margin-bottom: ${props => props.embedded ? '10px' : '0'};
  
//   @media (max-width: 1024px) {
//     position: relative;
//     top: auto;
//     left: auto;
//     margin-bottom: 20px;
//   }
  
//   @media (max-width: 768px) {
//     padding: 12px 16px;
//     font-size: 18px;
//     margin-bottom: 15px;
//   }
  
//   @media (max-width: 480px) {
//     padding: 10px 14px;
//     font-size: 16px;
//     margin-bottom: 10px;
//   }
// `;

const GreetingContainer = styled.div`
  background-color: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: bold;
  color: black;

  width: fit-content;

  /* ✅ DESKTOP (default) → LEFT ALIGN */
  margin-left: 50px;
  margin-bottom: 20px;
  text-align: left;

  /* ✅ TABLET / SMALL SCREEN */
  @media (max-width: 1024px) {
    margin: 0 auto 20px auto;   /* center */
    text-align: center;
  }

  /* ✅ MOBILE */
  @media (max-width: 768px) {
    margin: 0 auto 15px auto;
    text-align: center;
  }

  @media (max-width: 480px) {
    /* ✅ MOBILE: Hide greeting (shown in header instead) */
    display: none;
  }
`;

const Greeting = ({ embedded = false }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
       fetch(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.username) setUser(data);
      })
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  return (
    <GreetingContainer embedded={embedded}>
      {getGreeting()}
      {user?.username ? `, ${user.username}` : ""}
    </GreetingContainer>
  );
};

export default Greeting;
