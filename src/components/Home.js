import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Greeting from "./Greetings";
import PeriodTracker from "./PeriodTracker";
import ExpertInsights from "./ExpertInsights";
import animation from "../assets/monster.gif";
import FeelingBox from "./FeelingBox";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";

// Global style reset
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background: linear-gradient(to bottom, #F8A6D8, #FF7BAF);
    min-height: 100vh; /* Changed height to min-height so it can expand if needed */
    display: flex;
    flex-direction: column; /* Stack elements vertically */
    overflow-x: hidden;
    overflow-y: auto; /* Allow vertical scrolling so sections below are visible */
  }
`;

//  NEW: Created a parent container to wrap both HomeContainer and ExpertInsightsContainer
const MainContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack HomeContainer and ExpertInsightsContainer */
  flex: 1; /* Takes up full available height */
  width: 100%;
`;

//  MODIFIED: Home container now takes up available space but doesn't prevent ExpertInsights from being displayed
const HomeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1; /* Takes available space without restricting ExpertInsights */
  margin-left: 90px;
  padding: 20px;
  width: calc(100vw - 120px);
  flex-direction: column;
  align-items: flex-start;
  
  
  @media (max-width: 1024px) {
    width: calc(100vw - 90px);
    padding: 16px;
  }
  
  @media (max-width: 768px) {
    width: calc(100vw - 90px);
    padding: 14px;
  }
  
  @media (max-width: 480px) {
    width: calc(100vw - 90px);
    padding: 12px 10px;
  }
`;

// Left Section (Greeting + GIF)
const LeftSection = styled.div`
  display: none;
`;

// Animation card to align with tracker and feeling box
const AnimationBox = styled.div`
  height: 280px;
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 12px;

  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 1024px) {
    height: auto;
    width: 100%;
    max-width: 360px;
  }
`;

// Center Section (Tracker)
const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;   /* ✅ center children */
  width: 100%;
  max-width: 1200px;     /* ✅ limits width nicely */
  margin: 0 auto;        /* ✅ centers entire section */

  @media (max-width: 1024px) {
    margin-top: 8px;
  }
  
  @media (max-width: 768px) {
    margin-top: 8px;
  }
`;

const TrackerContainer = styled.div`
  padding: 20px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  height: 280px; /* match row height on desktop */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

// Row that holds the tracker and the FeelingBox side-by-side on desktop
const TrackerRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 24px;
  

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

//  MODIFIED: Expert Insights container now has margin-bottom to ensure visibility
const ExpertInsightsContainer = styled.div`
  margin-left: 90px;                     /* ✅ SAME as HomeContainer */
  width: calc(100vw - 120px);           /* ✅ SAME width logic */
  padding: 30px 20px;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 20px;
  
  min-height: 400px;

  @media (max-width: 1024px) {
    width: calc(100vw - 90px);
    padding: 16px;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 90px);
    padding: 14px;
  }

  @media (max-width: 480px) {
    width: calc(100vw - 90px);
    padding: 12px 10px;
  }
`;

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [hasPeriodData, setHasPeriodData] = useState(false);

  useEffect(() => {
    const fetchPeriodData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8000/api/periods/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHasPeriodData(data && data.length > 0); // Adjust if your API returns a different structure
        } else {
          setHasPeriodData(false);
        }
      } catch {
        setHasPeriodData(false);
      }
    };
    if (isLoggedIn) fetchPeriodData();
  }, [isLoggedIn]);

  return (
    <>
      <GlobalStyle />
      <Sidebar />
      
      {/*  NEW: Wrapped everything inside MainContainer */}
      <MainContainer>
        
        {/*  MODIFIED: HomeContainer now sits inside MainContainer */}
        <HomeContainer>
          {/* Left Section removed; greeting embedded in AnimationBox */}

          {/* Center Section */}
          <Greeting/>
          <CenterSection>
            
            <TrackerRow>
              <AnimationBox>
                <img src={animation} alt="Heart Animation" />
              </AnimationBox>
              <TrackerContainer>
                {/* Show options only if logged in */}
                {isLoggedIn && (
                  <div style={{ display: "flex", gap: "20px", marginBottom: "20px", justifyContent: "center" }}>
                    <button onClick={() => navigate("/tracker-results")}>Track Now</button>
                    {hasPeriodData && (
                      <button onClick={() => navigate("/previous-results")}>View Previous Results</button>
                    )}
                  </div>
                )}
                <PeriodTracker />
              </TrackerContainer>
              <FeelingBox />
            </TrackerRow>
          </CenterSection>
        </HomeContainer>

        {/*  MODIFIED: ExpertInsightsContainer is now inside MainContainer but outside HomeContainer */}
        <ExpertInsightsContainer>
          <ExpertInsights />
        </ExpertInsightsContainer>
        
      </MainContainer>
    </>
  );
}

export default Home;
