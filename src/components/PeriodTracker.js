import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Styled components
const TrackerContainer = styled.div`
  background: #ffcce5;
  padding: 20px;
  border-radius: 15px;
  text-align: center;
  width: 700px;
  height: 250px;
  box-shadow: 0px 4px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    width: min(92vw, 640px);
    height: auto; /* allow height to shrink but keep horizontal layout inside */
    min-height: 220px;
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    width: min(94vw, 560px);
    padding: 12px;
    min-height: 200px;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 22px;
  color: black;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 40px;
  text-align: left;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr; /* keep horizontal grouping */
    gap: 12px 20px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 10px 12px;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  text-align: center;
  color: black;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 0;
    margin-right: 10px;
    text-align: left;
    flex: 1;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 5px;
    margin-right: 0;
    text-align: center;
  }
`;

const InputField = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 120px;
  text-align: center;
  color: black;
  
  @media (max-width: 768px) {
    width: 100px;
    padding: 10px;
  }
  
  @media (max-width: 480px) {
    width: 120px;
    padding: 8px;
  }
`;

const Button = styled.button`
  background: #ff6699;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-top: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #ff3366;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 16px;
    margin-top: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 15px;
    font-size: 14px;
    margin-top: 10px;
  }
`;

const SymbolButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  transition: all 0.2s ease;

  &:hover {
    color: #ff3366;
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    font-size: 18px;
    padding: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 5px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 12px;
  }
`;

const CounterDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 16px;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    gap: 10px;
  }
`;

const PeriodTracker = () => {
  const navigate = useNavigate();
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(0);
  const [periodLength, setPeriodLength] = useState(0);
  const [monthsToCalculate, setMonthsToCalculate] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/me", { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setIsLoggedIn(!!(data && data.username)))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleChange = (field, action) => {
    if (field === "cycle") {
      setCycleLength((prev) => {
        let newCycleLength = action === "increase" ? prev + 1 : prev - 1;
        if (newCycleLength < 21) return 21; // Prevent going below 21
        if (newCycleLength > 35) return 35; // Prevent going above 35
        return newCycleLength; // Update state only if within range
      });
    } else if (field === "period") {
      setPeriodLength(prev => (action === "increase" ? Math.min(prev + 1, 10) : Math.max(prev - 1, 0)));
    } else if (field === "months") {
      setMonthsToCalculate(prev => (action === "increase" ? Math.min(prev + 1, 3) : Math.max(prev - 1, 0)));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/periods/add-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ lastPeriod, cycleLength, periodLength, monthsToCalculate }),
      });
      const result = await response.json();
      console.log("Server response:", result);
      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  

  const handleTrackNow = () => {
    if (!lastPeriod) {
      alert("Please select the date of your last period.");
      return;
    }

    handleSubmit();

    const lastPeriodDate = new Date(lastPeriod);
    const validMonths = Math.max(monthsToCalculate, 1);
    let predictions = [];

    // for (let i = 0; i < validMonths; i++) {
    //   let nextCycleStart = new Date(lastPeriodDate);
    //   nextCycleStart.setDate(lastPeriodDate.getDate() + cycleLength * (i + 1));

    //   let nextCycleEnd = new Date(nextCycleStart);
    //   nextCycleEnd.setDate(nextCycleStart.getDate() + periodLength);

    //   predictions.push({
    //     start: nextCycleStart.toISOString().split("T")[0],
    //     end: nextCycleEnd.toISOString().split("T")[0],

    //   });
    // }
    console.log(lastPeriodDate);
    navigate("/tracker-results", { state: { lastPeriodDate, cycleLength, periodLength, monthsToCalculate } });
  };

  return (
    <TrackerContainer>
      <Title>GET YOUR TRACKER, GIRL!</Title>

      <InputsGrid>
        <InputWrapper>
          <Label>DATE OF YOUR LAST PERIOD?</Label>
          <InputField type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
        </InputWrapper>

        <InputWrapper>
          <Label>WHAT'S YOUR USUAL CYCLE LENGTH?</Label>
          <CounterDisplay>
            <SymbolButton onClick={() => handleChange("cycle", "decrease")}>➖</SymbolButton>
            <span>{cycleLength} days</span>
            <SymbolButton onClick={() => handleChange("cycle", "increase")}>➕</SymbolButton>
          </CounterDisplay>
        </InputWrapper>

        <InputWrapper>
          <Label>HOW LONG DID IT LAST?</Label>
          <CounterDisplay>
            <SymbolButton onClick={() => handleChange("period", "decrease")}>➖</SymbolButton>
            <span>{periodLength} days</span>
            <SymbolButton onClick={() => handleChange("period", "increase")}>➕</SymbolButton>
          </CounterDisplay>
        </InputWrapper>

        <InputWrapper>
          <Label>NO OF MONTHS TO CALCULATE?</Label>
          <CounterDisplay>
            <SymbolButton onClick={() => handleChange("months", "decrease")}>➖</SymbolButton>
            <span>{monthsToCalculate} months</span>
            <SymbolButton onClick={() => handleChange("months", "increase")}>➕</SymbolButton>
          </CounterDisplay>
        </InputWrapper>
      </InputsGrid>

      <ButtonRow>
        <Button onClick={handleTrackNow}>TRACK NOW</Button>
        {isLoggedIn && (
          <Button onClick={() => navigate("/previous-results")}>LOOK PAST RECORDS</Button>
        )}
      </ButtonRow>
    </TrackerContainer>
  );
};

export default PeriodTracker;
