import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import animation from "../assets/monster.gif";

const API_URL = process.env.REACT_APP_API_URL;

// Styled Components
const CardContainer = styled.div`
  width: 90%;
  min-height: 10px;
  margin: 0 auto; 
  box-sizing: border-box;
  background: white;
  border-radius: 14px;
  padding: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;

  @media (max-width: 480px) {
    width: 100%;
    border-radius: 14px;
    padding: 16px;
    box-shadow: none;
  }
`;

const MobileTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MobileAvatar = styled.div`
  display: none;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FFD6EA;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  @media (max-width: 480px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileCycleDetails = styled.div`
  @media (max-width: 480px) {
    flex: 1;
    min-width: 0;
  }
`;

const MobilePhaseText = styled.p`
  display: none;

  @media (max-width: 480px) {
    display: block;
    margin: 0 0 12px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
  }
`;

const Label = styled.p`
  font-size: 12px;
  color: #9b4d7b;
  margin: 0 0 6px 0;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 11px;
    color: #993556;
    margin: 0 0 2px;
  }
`;

const CycleDay = styled.h3`
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.2;

  span {
    font-size: 16px;
    color: #999;
    font-weight: normal;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    font-weight: 500;
    color: #4B1528;
    margin: 0;

    span {
      font-size: 12px;
      font-weight: 400;
      color: #993556;
    }
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: #f2dce5;
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;

  @media (max-width: 480px) {
    height: 5px;
    margin: 10px 0 0;
    background: #F4C0D1;
  }
`;

const ProgressBar = styled.div`
  height: 100%;
  background: #FF7BAF;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;

  @media (max-width: 480px) {
    background: #D4537E;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  margin-top: 10px;
  font-size: 13px;
  color: #666;

  @media (max-width: 480px) {
    display: none;
  }
`;

const PhaseLabel = styled.span`
  color: #9b4d7b;
  font-weight: 600;

  &::after {
    content: "·";
    margin-left: 4px;
  }
`;

const CountdownText = styled.span`
  color: #9b4d7b;
  font-weight: 600;
`;

// Blurred overlay for signed-out state
const BlurredContent = styled.div`
  filter: ${props => (props.isBlurred ? "blur(5px)" : "none")};
  opacity: ${props => (props.isBlurred ? 0.5 : 1)};
  pointer-events: ${props => (props.isBlurred ? "none" : "auto")};
  transition: all 0.3s ease;
`;

const LockOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: ${props => (props.show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 14px;
  backdrop-filter: blur(1px);
  z-index: 10;
  gap: 10px;

  @media (max-width: 480px) {
    border-radius: 12px;
    gap: 8px;
  }
`;

const LockIcon = styled.div`
  font-size: 0;
  color: #FF7BAF;
  margin-bottom: 4px;

  &::after {
    content: "\\1F512";
    font-size: 32px;
    content: "🔒";
  }

  @media (max-width: 480px) {
    margin-bottom: 2px;

    &::after {
      font-size: 28px;
    }
  }
`;

const OverlayText = styled.p`
  font-size: 13px;
  color: #333;
  margin: 0;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const SignInButton = styled.button`
  background: #FF7BAF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2px;

  &:hover {
    background: #ff3366;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 12px;
  }
`;

// ===== COMPONENT =====
const CycleCountdownCard = () => {
  const { isLoggedIn, loading: authLoading, authFetch } = useAuth();
  const navigate = useNavigate();
  const [periodData, setPeriodData] = useState(null);
  const [cycleInfo, setCycleInfo] = useState(null);
  const [loading, setLoading] = useState(isLoggedIn);
  const [authFailed, setAuthFailed] = useState(false);

  // Fetch period data for signed-in users
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      setAuthFailed(false);
      return;
    }

    const fetchPeriodData = async () => {
      try {
        setLoading(true);
        setAuthFailed(false);
        // Login uses Passport sessions, so this request must send its session cookie.
        const res = await authFetch(`${process.env.REACT_APP_API_URL}/api/periods/user-session`);
        const data = res.ok ? await res.json() : null;

        // A stale or invalid session should render the signed-out card,
        // rather than exposing an API error to the user.
        if (res && res.status === 401) {
          setAuthFailed(true);
          setPeriodData(null);
          return;
        }

        // Get the most recent period entry (sort by lastPeriod desc)
        if (data && data.length > 0) {
          data.sort((a, b) => new Date(b.lastPeriod) - new Date(a.lastPeriod));
          setPeriodData(data[0]);
        }
      } catch (err) {
        console.error("Error fetching period data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeriodData();
  }, [isLoggedIn]);

  // Calculate cycle information when period data changes
  useEffect(() => {
    if (!periodData) {
      setCycleInfo(null);
      return;
    }

    const lastPeriodDate = new Date(periodData.lastPeriod);
    const cycleLength = periodData.cycleLength || 28;
    const periodLength = periodData.periodLength || 5;
    const today = new Date();

    // Calculate days since last period
    const daysSinceLastPeriod = Math.floor(
      (today - lastPeriodDate) / (1000 * 60 * 60 * 24)
    );

    // Current day in cycle (1-based)
    const currentDay = (daysSinceLastPeriod % cycleLength) + 1;

    // Days until next period (days remaining in this cycle)
    const daysRemainingInCycle = cycleLength - currentDay;
    // If we're in the period, show 0. Otherwise, show days until next period starts.
    const daysUntilNextPeriod = currentDay <= periodLength ? 0 : daysRemainingInCycle;

    // Determine phase
    let phase = "Menstruation";
    if (currentDay <= periodLength) {
      phase = "Menstruation phase";
    } else if (currentDay <= periodLength + 9) {
      phase = "Follicular phase";
    } else if (currentDay <= periodLength + 12) {
      phase = "Ovulation phase";
    } else {
      phase = "Luteal phase";
    }

    const percentage = ((currentDay - 1) / cycleLength) * 100;

    setCycleInfo({
      currentDay,
      cycleLength,
      daysUntilNextPeriod,
      phase,
      percentage: Math.min(percentage, 100),
    });
  }, [periodData]);

  const handleSignIn = () => {
    navigate("/login");
  };

  // Render skeleton if loading
  if (authLoading || (loading && isLoggedIn)) {
    return (
      <CardContainer>
        <MobileTopRow>
          <MobileAvatar><img src={animation} alt="" /></MobileAvatar>
          <MobileCycleDetails>
            <Label>Loading...</Label>
          </MobileCycleDetails>
        </MobileTopRow>
      </CardContainer>
    );
  }

  // Render the sign-in preview for signed-out or expired sessions.
  if (!isLoggedIn || authFailed) {
    return (
      <>
      <CardContainer>
        <BlurredContent isBlurred={true}>
          <MobileTopRow>
            <MobileAvatar><img src={animation} alt="" /></MobileAvatar>
            <MobileCycleDetails>
              <Label>Your cycle</Label>
              <CycleDay>
                Day 14 <span>of 28</span>
              </CycleDay>
            </MobileCycleDetails>
          </MobileTopRow>
          <ProgressBarContainer>
            <ProgressBar percentage={50} />
          </ProgressBarContainer>
          <InfoRow>
            <PhaseLabel>Ovulation phase</PhaseLabel>
            <CountdownText>Period in 14 days</CountdownText>
          </InfoRow>
        </BlurredContent>

        <LockOverlay show={true}>
          <LockIcon>🔒</LockIcon>
          <OverlayText>Sign in to see your cycle</OverlayText>
          <SignInButton onClick={handleSignIn}>Sign in</SignInButton>
        </LockOverlay>
      </CardContainer>
      <MobilePhaseText>Ovulation phase · Period in 14 days</MobilePhaseText>
      </>
    );
  }

  // Render live data if logged in
  if (cycleInfo) {
    return (
      <CardContainer>
        <BlurredContent isBlurred={false}>
          <Label>Your cycle</Label>
          <CycleDay>
            Day {cycleInfo.currentDay} <span>of {cycleInfo.cycleLength}</span>
          </CycleDay>
          <ProgressBarContainer>
            <ProgressBar percentage={cycleInfo.percentage} />
          </ProgressBarContainer>
          <InfoRow>
            <PhaseLabel>{cycleInfo.phase}</PhaseLabel>
            <CountdownText>
              {cycleInfo.daysUntilNextPeriod === 0 ? (
                <>Period today!</>
              ) : cycleInfo.daysUntilNextPeriod === 1 ? (
                <>Period tomorrow!</>
              ) : (
                <>Period in {cycleInfo.daysUntilNextPeriod} days</>
              )}
            </CountdownText>
          </InfoRow>
        </BlurredContent>
      </CardContainer>
    );
  }

  // Render empty state if no cycle data exists
  return (
    <CardContainer>
      <Label>Your cycle</Label>
      <p style={{ color: "#999", fontSize: "13px", margin: "8px 0 0 0" }}>
        Track your cycle to see insights
      </p>
    </CardContainer>
  );
};

export default CycleCountdownCard;
