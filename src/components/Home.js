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
    overflow: hidden; /* Removed scrolling */
  }
`;

// ✅ NEW: Created a parent container to wrap both HomeContainer and ExpertInsightsContainer
const MainContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack HomeContainer and ExpertInsightsContainer */
  flex: 1; /* Takes up full available height */
  width: 100%;
`;

// ✅ MODIFIED: Home container now takes up available space but doesn't prevent ExpertInsights from being displayed
const HomeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1; /* Takes available space without restricting ExpertInsights */
  margin-left: 90px;
  padding: 20px;
  width: calc(100vw - 120px);
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* Ensures full height */
`;

// Left Section (Greeting + GIF)
const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

// GIF Container
const AnimationContainer = styled.div`
  position: absolute;
  left: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 80px;
  transform: translateX(-40px);
  z-index: 2;

  img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  }
`;

// Center Section (Tracker)
const CenterSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 3%;
  left: 54%;
  transform: translateX(-50%);
`;

const TrackerContainer = styled.div`
  padding: 20px;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
`;

// ✅ MODIFIED: Expert Insights container now has margin-bottom to ensure visibility
const ExpertInsightsContainer = styled.div`
  margin-top: 50px;
  text-align: center;
  margin-bottom: 20px; /* Added margin to prevent overlap */
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
      
      {/* ✅ NEW: Wrapped everything inside MainContainer */}
      <MainContainer>
        
        {/* ✅ MODIFIED: HomeContainer now sits inside MainContainer */}
        <HomeContainer>
          {/* Left Section */}
          <LeftSection>
            <Greeting />
            <AnimationContainer>
              <img src={animation} alt="Heart Animation" />
            </AnimationContainer>
          </LeftSection>

          {/* Center Section */}
          <CenterSection>
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
          </CenterSection>

          <FeelingBox />
        </HomeContainer>

        {/* ✅ MODIFIED: ExpertInsightsContainer is now inside MainContainer but outside HomeContainer */}
        <ExpertInsightsContainer>
          <ExpertInsights />
        </ExpertInsightsContainer>
        
      </MainContainer>
    </>
  );
}

export default Home;
