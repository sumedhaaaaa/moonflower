import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Importing icons

const ExpertInsights = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startIndex, setStartIndex] = useState(0); // Track visible articles

  useEffect(() => {
    fetch("http://localhost:8000/api/articles")
      .then((res) => res.json())
      .then((data) => {
        console.log("Articles fetched:", data);
        setArticles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading articles...</p>;
  if (error) return <p>Error loading articles: {error}</p>;

  // Handle Next and Previous buttons
  const handleNext = () => {
    setStartIndex((prev) => (prev + 6 >= articles.length ? 0 : prev + 6));
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 6 < 0 ? articles.length - 6 : prev - 6));
  };

  return (
    <Container>
    <WhiteBlock>
      <Title>Expert Insights</Title>

        <ArrowButton onClick={handlePrev}>
          <FaChevronLeft size={24} />
        </ArrowButton>
        <ArticleWrapper>
        <ArticleList>
          {articles.length > 0 ? (
            articles.slice(startIndex, startIndex + 7).map((article, index) => (
              <ArticleItem key={index}>
                <a
                  href={article.link || article.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
              </ArticleItem>
            ))
          ) : (
            <p>No articles found.</p>
          )}
        </ArticleList>

        
        </ArticleWrapper>
        <ArrowButton onClick={handleNext}>
          <FaChevronRight size={24} />
        </ArrowButton>
      </WhiteBlock>
     
    </Container>
  );
};

export default ExpertInsights;

// Styled Components
const Container = styled.div`
  position: relative;
  bottom : 400px; /* Adjust this if needed */
  justify-content: center; 
  align-items: center; 
  width: 90%;
  margin: 0 auto;
  padding: 10px;
  text-align: center;
`;

const ArticleWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  background: #ff9cc8; /* White background for the block */
  padding: 0px; /* Increase padding for more space */
  border-radius: 15px;
  
  min-height: 150px; /* Increase height of the white box */
`;



const WhiteBlock = styled.div`
  height: 250px;
  position:relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ff9cc8;
  border-radius: 15px;
  padding: 20px;
  width: 95%;
  transform: translateX(50px); 
  margin: 0 auto;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  position: absolute;
  bottom : 215px;
  left: 30px;
  font-size: 1.5em;
  color: #333;
  margin: 0 auto;
`;

const ArticleList = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  overflow: hidden;
  width: 90%;
`;

const ArticleItem = styled.div`
  width: 150px;
  background: white;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  color: #555;

  &:hover {
    color: #000;
  }
`;
