import React from "react";
import styled from "styled-components";
import Logo from "../assets/logo.png"; // Website Logo
import ProfileIcon from "../assets/profile.png"; // Profile Icon
import SettingsIcon from "../assets/settings.png"; // Settings Icon
import { useNavigate } from "react-router-dom";

const SidebarContainer = styled.div`
  width: 80px;
  height: 100vh;
  background-color: #FCCAE5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  position: fixed;
  left: 0;  /* Fix the sidebar to the very left */
  top: 0;
  z-index: 1000; 
`;

const LogoImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;

const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 2.5px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;

const IconImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

// Smaller size for Settings Icon only
const SettingsIconImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

function Sidebar() {
  const navigate = useNavigate();
  return (
    <SidebarContainer>
      <LogoImage src={Logo} alt="MoonFlower Logo" />
      <SidebarBottom>
        {/* Smaller Settings Button */}
        <IconButton>
          <SettingsIconImage src={SettingsIcon} alt="Settings" />
        </IconButton>
        {/* Profile Button (Same Size) */}
        <IconButton onClick={() => navigate("/signup")}>
          <IconImage src={ProfileIcon} alt="Profile" />
        </IconButton>
      </SidebarBottom>
    </SidebarContainer>
  );
}

export default Sidebar;
