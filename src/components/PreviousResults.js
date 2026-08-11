import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom, #F8A6D8, #FF7BAF);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
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
  margin-bottom: 30px;
  
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

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const RecordsContainer = styled.div`
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const RecordCard = styled.div`
  background: #fff5f8;
  border: 2px solid #ffcce5;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ffcce5;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
    padding-bottom: 8px;
  }
`;

const RecordDate = styled.h3`
  color: #ff6699;
  font-size: 1.2rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const RecordDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const DetailItem = styled.div`
  text-align: center;
  
  @media (max-width: 768px) {
    text-align: left;
  }
  
  @media (max-width: 480px) {
    text-align: center;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  font-weight: bold;
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  color: #333;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const ViewPredictionsButton = styled.button`
  background: #ff6699;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  transition: all 0.2s ease;

  &:hover {
    background: #ff3366;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
    margin-top: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 12px;
    margin-top: 6px;
  }
`;

const NoRecords = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    padding: 30px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    font-size: 1rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2rem;
  
  @media (max-width: 768px) {
    padding: 30px;
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    font-size: 1rem;
  }
`;

const PreviousResults = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/periods/user-session`, {
        credentials: "include"
      });
      
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      } else if (res.status === 401) {
        setError("Please log in to view your records");
      } else {
        setError("Failed to fetch records");
      }
    } catch (err) {
      setError("Error loading records");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewPredictions = (record) => {
    // Navigate to TrackerResults with the record data
    navigate("/tracker-results", { 
      state: { 
        lastPeriodDate: new Date(record.lastPeriod),
        cycleLength: record.cycleLength,
        periodLength: record.periodLength,
        monthsToCalculate: record.monthsToCalculate,
        isFromHistory: true
      } 
    });
  };

  if (loading) {
    return (
      <Container>
        <Loading>Loading your records...</Loading>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate("/")}>← Back to Home</BackButton>
          <Title>Past Records</Title>
        </Header>
        <RecordsContainer>
          <NoRecords>{error}</NoRecords>
        </RecordsContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/")}>← Back to Home</BackButton>
        <Title>Your Past Records</Title>
      </Header>
      
      <RecordsContainer>
        {records.length === 0 ? (
          <NoRecords>
            No past records found. Start tracking your periods to see your history here!
          </NoRecords>
        ) : (
          records.map((record, index) => (
            <RecordCard key={index}>
              <RecordHeader>
                <RecordDate>Record #{records.length - index}</RecordDate>
                <RecordDate>{formatDate(record.createdAt)}</RecordDate>
              </RecordHeader>
              <RecordDetails>
                <DetailItem>
                  <DetailLabel>Last Period Date</DetailLabel>
                  <DetailValue>{formatDate(record.lastPeriod)}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Cycle Length</DetailLabel>
                  <DetailValue>{record.cycleLength} days</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Period Length</DetailLabel>
                  <DetailValue>{record.periodLength} days</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Months Calculated</DetailLabel>
                  <DetailValue>{record.monthsToCalculate} months</DetailValue>
                </DetailItem>
              </RecordDetails>
              <ViewPredictionsButton onClick={() => handleViewPredictions(record)}>
                View Calculated Predictions
              </ViewPredictionsButton>
            </RecordCard>
          ))
        )}
      </RecordsContainer>
    </Container>
  );
};

export default PreviousResults; 