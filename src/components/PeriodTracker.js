import React, { useState } from "react";
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
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 22px;
  color: black;
`;

const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 40px;
  text-align: left;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  text-align: center;
  color: black;
`;

const InputField = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 120px;
  text-align: center;
  color: black;
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

  &:hover {
    background: #ff3366;
  }
`;

const SymbolButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;

  &:hover {
    color: #ff3366;
  }
`;

const PeriodTracker = () => {
  const navigate = useNavigate();
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(0);
  const [periodLength, setPeriodLength] = useState(0);
  const [monthsToCalculate, setMonthsToCalculate] = useState(0);

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
      setMonthsToCalculate(prev => (action === "increase" ? Math.min(prev + 1, 12) : Math.max(prev - 1, 0)));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/periods/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
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
          <div>
            <SymbolButton onClick={() => handleChange("cycle", "decrease")}>➖</SymbolButton>
            <span>{cycleLength} days</span>
            <SymbolButton onClick={() => handleChange("cycle", "increase")}>➕</SymbolButton>
          </div>
        </InputWrapper>

        <InputWrapper>
          <Label>HOW LONG DID IT LAST?</Label>
          <div>
            <SymbolButton onClick={() => handleChange("period", "decrease")}>➖</SymbolButton>
            <span>{periodLength} days</span>
            <SymbolButton onClick={() => handleChange("period", "increase")}>➕</SymbolButton>
          </div>
        </InputWrapper>

        <InputWrapper>
          <Label>NO OF MONTHS TO CALCULATE?</Label>
          <div>
            <SymbolButton onClick={() => handleChange("months", "decrease")}>➖</SymbolButton>
            <span>{monthsToCalculate} months</span>
            <SymbolButton onClick={() => handleChange("months", "increase")}>➕</SymbolButton>
          </div>
        </InputWrapper>
      </InputsGrid>

      <Button onClick={handleTrackNow}>
        TRACK NOW <span style={{ fontSize: "18px", marginLeft: "5px" }}>❤️</span>
      </Button>
    </TrackerContainer>
  );
};

export default PeriodTracker;
