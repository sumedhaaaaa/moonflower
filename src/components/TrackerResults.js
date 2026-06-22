import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import bgVideo from "../assets/fotor-video_enhancer-preview-20250627110307.mp4";

// Styled Components
const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 15px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 900px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    margin-bottom: 15px;
  }
`;

const BackButton = styled.button`
  background: #ff6699;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: #ff3366;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

const PageTitle = styled.h1`
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const SummaryBox = styled.div`
  background: white;
  padding: 12px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 70%;
  max-width: 500px;
  text-align: center;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    width: 90%;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    width: 95%;
    padding: 8px;
    margin-bottom: 15px;
  }
`;

const SummaryText = styled.p`
  font-size: 14px;
  font-weight: bold;
  color: #ff6699;
  margin: 3px 0;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: nowrap;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 15px;
  }
`;

const MonthHeading = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: 5px;
  }
`;

const BigCalendarBox = styled.div`
  background: #d55574;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 900px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
    width: 95%;
    margin-top: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    width: 98%;
    margin-top: 10px;
  }
`;

const StyledCalendar = styled(Calendar)`
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ff99cc;
  width: 100%;
  max-width: 260px;
  
  .react-calendar__month-view__days__day {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 8px;
    font-size: 12px;
    text-align: center;
  }
  
  .react-calendar__month-view__weekdays {
    background-color: #ff99cc;
    color: white;
    font-weight: bold;
    font-size: 12px;
  }
  
  .react-calendar__tile {
    padding: 8px;
    color: black;
  }
  
  .react-calendar__month-view__days__day:nth-child(7n) {
    border-right: none;
  }
  
  .react-calendar__month-view__days__day:nth-last-child(-n+7) {
    border-bottom: none;
  }
  
  /* Highlight period days */
  .highlight-period {
    background-color: #ff6699 !important;
    color: white;
  }
  
  /* Highlight fertile window days */
  .highlight-fertile {
    background-color: #66cc66 !important;
    color: white;
  }
  
  /* Highlight ovulation day */
  .highlight-ovulation {
    background-color: #3399ff !important;
    color: white;
  }
  
  /* Highlight estimated due date */
  .highlight-due {
    background-color: #FFD700 !important;
    color: black;
  }
  
  @media (max-width: 768px) {
    max-width: 280px;
    
    .react-calendar__month-view__days__day {
      padding: 6px;
      font-size: 11px;
    }
    
    .react-calendar__tile {
      padding: 6px;
    }
    
    .react-calendar__month-view__weekdays {
      font-size: 11px;
    }
  }
  
  @media (max-width: 480px) {
    max-width: 250px;
    
    .react-calendar__month-view__days__day {
      padding: 4px;
      font-size: 10px;
    }
    
    .react-calendar__tile {
      padding: 4px;
    }
    
    .react-calendar__month-view__weekdays {
      font-size: 10px;
    }
  }
`;

const BackgroundVideo = styled.video`
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100vw;
  min-height: 100vh;
  width: auto;
  height: auto;
  z-index: -1;
  object-fit: cover;
  opacity: 0.25;
  pointer-events: none;
`;

const cloneDate = (date) => new Date(date.getTime());

// Helper to get all dates between two dates (inclusive)
const getDatesInRange = (start, end) => {
  const dates = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Generate all the cycle predictions
const generateCycleDates = (startDate, cycleLength, periodLength, months) => {
  let predictions = [];
  let currentDate = new Date(startDate);
  for (let i = 0; i < months + 2; i++) { // Generate enough cycles to cover 3 months
    const periodStart = cloneDate(currentDate);
    const periodEnd = new Date(periodStart.getTime());
    periodEnd.setDate(periodEnd.getDate() + periodLength - 1);
    const ovulationDay = new Date(periodStart.getTime());
    ovulationDay.setDate(ovulationDay.getDate() + (cycleLength - 14));
    const fertileStart = new Date(ovulationDay.getTime());
    fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ovulationDay.getTime());
    fertileEnd.setDate(fertileEnd.getDate() + 1);
    predictions.push({
      periodStart,
      periodEnd,
      ovulationDay,
      fertileStart,
      fertileEnd,
    });
    currentDate.setDate(currentDate.getDate() + cycleLength);
  }
  return predictions;
};

const TrackerResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lastPeriodDate, cycleLength, periodLength, monthsToCalculate, isFromHistory } = location.state || {};
  
  if (!lastPeriodDate) {
    return (
      <ResultsContainer>
        <SummaryBox>
          <SummaryText>No data available. Please enter your cycle details first.</SummaryText>
        </SummaryBox>
      </ResultsContainer>
    );
  }

  const parsedStartDate = new Date(lastPeriodDate);
  const cyclePredictions = generateCycleDates(parsedStartDate, cycleLength, periodLength, monthsToCalculate);
  
  // Gather all period, fertile, and ovulation days for the next 3 calendar months
  const today = new Date();
  const monthsToShow = [];
  for (let i = 0; i < 3; i++) {
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
    monthsToShow.push(firstOfMonth);
  }
  
  // Build a map of dates to highlight type for each month
  const getHighlightMap = (monthDate) => {
    const map = {};
    cyclePredictions.forEach(cycle => {
      // Period days
      getDatesInRange(cycle.periodStart, cycle.periodEnd).forEach(d => {
        const key = d.toISOString().split("T")[0];
        map[key] = "highlight-period";
      });
      // Fertile window days
      getDatesInRange(cycle.fertileStart, cycle.fertileEnd).forEach(d => {
        const key = d.toISOString().split("T")[0];
        // Only set if not already period
        if (!map[key]) map[key] = "highlight-fertile";
      });
      // Ovulation day (single day)
      const ovKey = cycle.ovulationDay.toISOString().split("T")[0];
      map[ovKey] = "highlight-ovulation";
    });
    return map;
  };
  
  // Next period and due date (from next cycle)
  const nextCycle = cyclePredictions.find(c => c.periodStart > today) || cyclePredictions[1];
  const dueDate = new Date(nextCycle.periodStart.getTime() + 280 * 24 * 60 * 60 * 1000);

  const handleBackClick = () => {
    if (isFromHistory) {
      navigate("/previous-results");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <BackgroundVideo autoPlay loop muted playsInline>
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </BackgroundVideo>
      <ResultsContainer>
        <Header>
          <BackButton onClick={handleBackClick}>
            ← {isFromHistory ? "Back to Records" : "Back to Home"}
          </BackButton>
          <PageTitle>
            {isFromHistory ? "Historical Predictions" : "Your Period Predictions"}
          </PageTitle>
        </Header>
        
        <SummaryBox>
          <SummaryText>📅 Next Period: {nextCycle.periodStart.toISOString().split("T")[0]}</SummaryText>
          <SummaryText>
            🌱 Fertile Window: {nextCycle.fertileStart.toISOString().split("T")[0]} - {nextCycle.fertileEnd.toISOString().split("T")[0]}
          </SummaryText>
          <SummaryText>👶 Estimated Due Date (if pregnant): {dueDate.toISOString().split("T")[0]}</SummaryText>
          {isFromHistory && (
            <SummaryText style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
              📊 Based on record from {parsedStartDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </SummaryText>
          )}
        </SummaryBox>
        
        <BigCalendarBox>
          <CalendarContainer>
            {monthsToShow.map((monthDate, idx) => {
              const highlightMap = getHighlightMap(monthDate);
              return (
                <div key={idx}>
                  <MonthHeading>
                    {monthDate.toLocaleString("default", { month: "long", year: "numeric" })}
                  </MonthHeading>
                  <StyledCalendar
                    activeStartDate={monthDate}
                    value={null}
                    tileClassName={({ date }) => {
                      const dateString = date.toISOString().split("T")[0];
                      if (date.getMonth() !== monthDate.getMonth() || date.getFullYear() !== monthDate.getFullYear()) {
                        return null;
                      }
                      return highlightMap[dateString] || null;
                    }}
                  />
                </div>
              );
            })}
          </CalendarContainer>
        </BigCalendarBox>
      </ResultsContainer>
    </>
  );
};

export default TrackerResults;
