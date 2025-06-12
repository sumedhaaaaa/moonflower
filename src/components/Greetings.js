import React, { useState, useEffect } from "react";
import styled from "styled-components";

const GreetingContainer = styled.div`
background-color: white;
padding: 15px 20px;
border-radius: 8px;
box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
font-size: 20px;
font-weight: bold;
color: black;
width: fit-content;
position: absolute;
top: 20px;
left: 120px; /* Moves it further from the sidebar */
z-index: 1001;
`;


const Greeting = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // Stop if no token is found

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []); // Empty dependency array ensures it runs once when mounted


  // useEffect (() => { 
  //   setUser({firstName: "Subhajit"});
  // },[]);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 16) return "Good Afternoon";
    if (hour >= 16 && hour < 20) return "Good Evening";
    return "Good Night";
  };

  return (
    <GreetingContainer>
      {getGreeting()}
      {user?.firstName ? `, ${user.firstName}` : ""}
    </GreetingContainer>
  );
};

export default Greeting;
