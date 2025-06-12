import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Styled Components
const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(to bottom, #F8A6D8, #FF7BAF);
  min-height: 100vh;
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
`;

const SummaryBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 600px;
  text-align: center;
  margin-bottom: 20px;
`;

const SummaryText = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #ff6699;
  margin: 5px 0;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
`;

const MonthHeading = styled.h3`
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 10px;
`;

const StyledCalendar = styled(Calendar)`
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #ff99cc;
  width: 100%;
  max-width: 280px;
  .react-calendar__month-view__days__day {
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 10px;
    font-size: 14px;
    text-align: center;
  }
  .react-calendar__month-view__weekdays {
    background-color: #ff99cc;
    color: white;
    font-weight: bold;
  }
  .react-calendar__tile {
    padding: 12px;
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
  const { lastPeriodDate, cycleLength, periodLength, monthsToCalculate } = location.state || {};
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
  return (
    <ResultsContainer>
      <SummaryBox>
        <SummaryText>📅 Next Period: {nextCycle.periodStart.toISOString().split("T")[0]}</SummaryText>
        <SummaryText>
          🌱 Fertile Window: {nextCycle.fertileStart.toISOString().split("T")[0]} - {nextCycle.fertileEnd.toISOString().split("T")[0]}
        </SummaryText>
        <SummaryText>👶 Estimated Due Date (if pregnant): {dueDate.toISOString().split("T")[0]}</SummaryText>
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
  );
};

export default TrackerResults;
