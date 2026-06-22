import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ExpertInsights = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ITEM_WIDTH_PX = 150;
  const ITEM_GAP_PX = 20;

  // ✅ Fetch articles
  useEffect(() => {
    fetch("http://localhost:8000/api/articles")
      .then(res => res.json())
      .then(data => setArticles(data))
      .catch(err => console.error(err));
  }, []);

  const nextInsight = () => {
    if (articles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  };

  const prevInsight = () => {
    if (articles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  };

  return (
    <Container>
      <ArticleWrapper>
        <Title>Expert Insights</Title>

        <WhiteBlock>
          <ArticleList>
  {articles.map((item, index) => {
    const isActive = index === currentIndex;

    return (
      <ArticleItem
        key={index}
        style={{
          transform: isActive ? "scale(1.0)" : "scale(0.9)",
          
        }}
      >
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </ArticleItem>
    );
  })}
</ArticleList>

          <NavigationButton position="left" onClick={prevInsight}>
            ❮
          </NavigationButton>
          <NavigationButton position="right" onClick={nextInsight}>
            ❯
          </NavigationButton>
        </WhiteBlock>
      </ArticleWrapper>
    </Container>
  );
};

export default ExpertInsights;

//////////////////////////////////////////////////////////
// Styled Components (FIXED ONLY SYNTAX, DESIGN SAME)
//////////////////////////////////////////////////////////

const Container = styled.div`
  width: 90%;
  margin: 20px auto;

  @media (max-width: 768px) {
    width: 95%;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 5px;
  }
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #ff9cc8;
  border-radius: 15px;
  padding: 15px;
`;

const WhiteBlock = styled.div`
 position: relative;   /* ✅ REQUIRED for buttons */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  padding: 20px;
  width: 100%;
  overflow: hidden; 
  flex: 1;  
`;

const Title = styled.h2`
  font-size: 1.5em;
  color: #333;
  margin: 0 auto 10px auto;
  text-align: left;
`;

const ArticleList = styled.div`
  display: flex;
  overflow-x: auto;
  width: 100%;
  gap: 15px;
  scroll-behavior: smooth;

  padding: 10px 55px;   /* ✅ important fix */
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }

  scroll-snap-type: x mandatory;

  @media (max-width: 768px) {
    padding: 10px 45px;
    gap: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px 40px;
    gap: 10px;
  }
`;

const ArticleItem = styled.div`
  min-width: 160px;
  max-width: 200px;
  height: 90px;
  flex-shrink: 0;
  
  background: white;
border-radius: 15px;

display: flex;
align-items: center;
justify-content: center;

padding: 15px;
box-sizing: border-box;

text-align: center;
cursor: pointer;

  box-sizing: border-box;

  &:hover {
    transform: scale(1.03);
  }

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
  }

  scroll-snap-align: center;
  transition: all 0.3s ease;
`;



const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  cursor: pointer;
  z-index: 10;

  ${props => props.position === "left" ? "left: 5px;" : "right: 5px;"}

  &:hover {
    background: rgba(255, 255, 255, 1);
  }
`;