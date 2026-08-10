import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Greeting from "./Greetings";
import PeriodTracker from "./PeriodTracker";
import ExpertInsights from "./ExpertInsights";
import CycleCountdownCard from "./CycleCountdownCard";
import animation from "../assets/monster.gif";
import FeelingBox from "./FeelingBox";
import styled, { createGlobalStyle } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";

// Global style reset
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background: linear-gradient(to bottom, #F8A6D8, #FF7BAF);
    height: 100dvh;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ✅ MOBILE: Hide sidebar at 480px breakpoint */
  @media (max-width: 480px) {
    body {
      flex-direction: column;
      padding: 70px 0 0; /* Space for mobile header */
      height: 100dvh;
      overflow: hidden;
    }
  }
`;

//  NEW: Created a parent container to wrap both HomeContainer and ExpertInsightsContainer
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;

  @media (max-width: 480px) {
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const MobileQuickTiles = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    order: 2;
    gap: 12px;
    width: 100%;
    padding: 0 12px;
    margin: 0 0 12px;
  }
`;

const MobileTile = styled.button`
  flex: 1;
  min-width: 0;
  background: #fff;
  border: none;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;

  svg {
    font-size: 20px;
    color: #D4537E;
  }

  span {
    font-size: 11px;
    color: #4B1528;
    margin: 6px 0 0;
  }
`;

const DesktopTrackerButtons = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;

  @media (max-width: 480px) {
    display: none;
  }
`;

const DesktopFeelingBox = styled.div`
  display: contents;

  @media (max-width: 480px) {
    display: none;
  }
`;

// ✅ NEW MOBILE HEADER: Only visible at max-width: 480px
const MobileHeader = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 70px;
    background-color: #FCCAE5;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    z-index: 1001;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

// ✅ Mobile header avatar (left)
const MobileHeaderAvatar = styled.img`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

// ✅ Mobile header greeting text (center-left, takes flex space)
const MobileHeaderGreeting = styled.span`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: black;
    margin-left: 10px;
    flex: 1;
  }
`;

// ✅ Mobile header settings icon (right)
const MobileHeaderSettings = styled.img`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
`;

// ✅ MOBILE HERO BANNER: Mascot + tagline (only mobile)
const MobileHeroBanner = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: flex; /* show hero on mobile */
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: #FF7BAF;
    border-radius: 12px;
    padding: 6px 8px;
    width: calc(100% - 16px);
    gap: 10px;
    margin: 1px 4px 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);

    img {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      object-fit: cover;
    }

    p {
      font-size: 13px;
      color: #fff;
      font-weight: 600;
      text-align: left;
      margin: 0;
    }
  }
`;

//  MODIFIED: Home container now takes up available space but doesn't prevent ExpertInsights from being displayed
const HomeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1; /* Takes available space without restricting ExpertInsights */
  margin-left: 90px;
  padding: 8px 20px 0;
  width: calc(100vw - 120px);
  flex-direction: column;
  align-items: flex-start;
  min-height: 0;
  order: 1;
  
  
  @media (max-width: 1024px) {
    width: calc(100vw - 90px);
    padding: 8px 16px 0;
  }
  
  @media (max-width: 768px) {
    width: calc(100vw - 90px);
    padding: 8px 14px 0;
  }
  
  @media (max-width: 480px) {
    /* ✅ MOBILE: Remove sidebar margin, take full width, stack vertically */
    margin-left: 0;
    width: 100%;
    padding: 0 8px 0;
    flex-direction: column;
    align-items: center;
    order: 2;
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

  @media (max-width: 480px) {
    display: none; /* ✅ MOBILE: Hide mascot, shown in hero banner instead */
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

  @media (max-width: 480px) {
    /* ✅ MOBILE: Full width, no max-width constraint */
    width: 100%;
    max-width: 100%;
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

  @media (max-width: 480px) {
    /* MOBILE: make this a prominent rounded card like the design */
    width: calc(100% - 24px);
    height: auto;
    padding: 16px;
    border-radius: 14px;
    margin-bottom: 12px;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  }
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

  @media (max-width: 480px) {
    /* ✅ MOBILE: Single column, full width */
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 0;
    /* make lightweight white tiles inside tracker look like cards */
    & > * {
      width: 100%;
      background: transparent; /* let child components control their card background */
      border-radius: 12px;
      padding: 12px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.06);
    }
  }
`;

//  MODIFIED: Expert Insights container now has margin-bottom to ensure visibility
const ExpertInsightsContainer = styled.div`
  margin-left: 90px;                     /* ✅ SAME as HomeContainer */
  width: calc(100vw - 120px);           /* ✅ SAME width logic */
  padding: 0 20px 4px;
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  order: 3;

  @media (max-width: 1024px) {
    width: calc(100vw - 90px);
    padding: 0 16px 4px;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 90px);
    padding: 0 14px 4px;
  }

  @media (max-width: 480px) {
    /* ✅ MOBILE: Remove sidebar margin, full width */
    padding-bottom: 12px;
    margin-left: 0;
    width: 100%;
    padding: 0 12px 4px;
    margin-top: 0;
    margin-bottom: 0;
    order: 4;
  }
`;

const MobileFeelingSection = styled.div`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    width: 100%;
    justify-content: center;
    padding: 0 12px 8px;
    order: 5;
  }
`;

// ✅ NEW: Cycle Countdown Card container - matches ExpertInsightsContainer styling
const CycleCountdownContainer = styled.div`
  margin-left: 90px;                     /* ✅ SAME as HomeContainer */
  width: calc(100vw - 120px);           /* ✅ SAME width logic */
  padding: 40px 20px;
  margin-top: 0;
  margin-bottom: 0;
  order: 2;

  @media (max-width: 1024px) {
    width: calc(100vw - 90px);
    padding: 10px 16px;
  }

  @media (max-width: 768px) {
    width: calc(100vw - 90px);
    padding: 10px 14px;
  }

  @media (max-width: 480px) {
    /* ✅ MOBILE: Remove sidebar margin, full width */
    margin-left: 0;
    width: 100%;
    padding: 12px 17px;
    margin-top: 0;
    margin-bottom: 0;
    order: 1;
  }
`;

function Home() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const [hasPeriodData, setHasPeriodData] = useState(false);
  const [user, setUser] = useState(null);

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

  // Fetch user info for mobile header
  useEffect(() => {
    fetch("http://localhost:8000/api/auth/me", {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.username) setUser(data);
      })
      .catch(() => {});
  }, []);

  const getMobileGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  return (
    <>
      <GlobalStyle />
      {/* ✅ DESKTOP: Show Sidebar (hidden on mobile via Sidebar component's own media query) */}
      <Sidebar />
      
      {/* ✅ MOBILE: Fixed header bar at top */}
      <MobileHeader>
        <MobileHeaderAvatar src={require("../assets/profile.png")} alt="Profile" />
        <MobileHeaderGreeting>
          {getMobileGreeting()}
          {user?.username ? `, ${user.username}` : ""}
        </MobileHeaderGreeting>
        <MobileHeaderSettings src={require("../assets/settings.png")} alt="Settings" />
      </MobileHeader>
      
      {/*  NEW: Wrapped everything inside MainContainer */}
      <MainContainer>
        
        {/* Cycle status appears first in the mobile visual order. */}
        <CycleCountdownContainer>
          <CycleCountdownCard />
        </CycleCountdownContainer>

        {/*  MODIFIED: HomeContainer now sits inside MainContainer */}
        <HomeContainer>
          {/* ✅ Hide greeting on mobile (shown in header instead) */}
          <Greeting/>
          
          {/* ✅ MOBILE: Hero banner with mascot (shown before tracker on mobile) */}
          <MobileHeroBanner>
            <img src={animation} alt="Mascot" />
            <p>Track your cycle with ease</p>
          </MobileHeroBanner>

          {/* Center Section */}
          <CenterSection>
            
            <TrackerRow>
              <AnimationBox>
                <img src={animation} alt="Heart Animation" />
              </AnimationBox>
              <TrackerContainer>
                {/* Show options only if logged in */}
                {isLoggedIn && (
                  <DesktopTrackerButtons>
                    <button onClick={() => navigate("/tracker-results")}>Track Now</button>
                    {hasPeriodData && (
                      <button onClick={() => navigate("/previous-results")}>View Previous Results</button>
                    )}
                  </DesktopTrackerButtons>
                )}
                <PeriodTracker />
              </TrackerContainer>
              <DesktopFeelingBox>
                <FeelingBox />
              </DesktopFeelingBox>
            </TrackerRow>
          </CenterSection>
        </HomeContainer>

        {/*  MODIFIED: ExpertInsightsContainer is now inside MainContainer but outside HomeContainer */}
        <ExpertInsightsContainer>
          <ExpertInsights />
        </ExpertInsightsContainer>

        <MobileFeelingSection>
          <FeelingBox />
        </MobileFeelingSection>
      </MainContainer>
    </>
  );
}

export default Home;
