import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ExpertInsights = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const ITEM_WIDTH_PX = 150;
  const ITEM_GAP_PX = 20;

  // ✅ Fetch articles
  useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/api/articles`)
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
  margin: 0 auto;

  @media (max-width: 768px) {
    width: 95%;
  }

  @media (max-width: 480px) {
    /* ✅ MOBILE: Full width with minimal padding */
    width: 100%;
    margin: 0;
    padding: 0;
  }
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #ff9cc8;
  border-radius: 15px;
  padding: 8px;

  @media (max-width: 480px) {
    /* ✅ MOBILE: Smaller padding, removed background */
    background: transparent;
    padding: 4px 0;
    border-radius: 0;
  }
`;

const WhiteBlock = styled.div`
 position: relative;   /* ✅ REQUIRED for buttons */
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  padding: 4px 20px;
  width: 100%;
  overflow: hidden; 
  flex: 1;

  @media (max-width: 480px) {
    /* ✅ MOBILE: Transparent, no padding */
    background: transparent;
    padding: 0;
    border-radius: 0;
  }
`;

const Title = styled.h2`
  font-size: 1.5em;
  color: #333;
  margin: 0 auto 4px auto;
  text-align: left;

  @media (max-width: 480px) {
    /* ✅ MOBILE: Left-aligned, smaller, margin adjustment */
    font-size: 14px;
    margin-left: 12px;
    margin-bottom: 4px;
    color: #333;
  }
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
    /* ✅ MOBILE: Full-width scroll, hide arrows, touch-friendly */
    padding: 0 12px;
    gap: 10px;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
`;

const ArticleItem = styled.div`
  min-width: 160px;
  max-width: 200px;
  height: 72px;
  flex-shrink: 0;
  
  background: white;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: scale(1.03);
  }

  a {
    color: black;
    text-decoration: none;
    font-weight: bold;
    font-size: 13px;
  }

  scroll-snap-align: center;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    /* ✅ MOBILE: Pill-shaped chips */
    min-width: 140px;
    max-width: 160px;
    height: 58px;
    padding: 8px;
    border-radius: 20px;
    background: white;

    a {
      font-size: 12px;
      font-weight: 500;
    }
  }
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
  background: rgba(255, 255, 255, 0.7);

  ${props => props.position === "left" ? "left: 5px;" : "right: 5px;"}

  &:hover {
    background: rgba(255, 255, 255, 1);
  }

  @media (max-width: 480px) {
    /* ✅ MOBILE: Hide navigation buttons */
    display: none;
  }
`;
