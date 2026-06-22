import React, { useEffect, useState } from "react";
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
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
`;

// Non-clickable profile image when logged in
const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  cursor: ${props => props.isLoggedIn ? 'default' : 'pointer'};
  opacity: ${props => props.isLoggedIn ? '0.8' : '1'};
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
  transition: transform 0.2s ease;
  
  ${IconButton}:hover & {
    transform: scale(1.1);
  }
`;

const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isOpen"
})`
  position: absolute;
  bottom: 100%;
  right: -70px; /* Moved further to the right */
  transform: none;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  margin-bottom: 10px;
  min-width: 120px;
  z-index: 1001;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button`
  background: none;
  border: none;
  padding: 8px 16px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const DropdownArrow = styled.div`
  position: absolute;
  bottom: -5px;
  right: 90px; /* Positioned to point to the settings button */
  transform: none;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
`;

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch user info from session-based endpoint
    fetch("http://localhost:8000/api/auth/me", {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.username) setUser(data);
      })
      .catch(() => {});
  }, []);

  const handleSettingsClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    // Only allow clicking if user is NOT logged in
    if (!user) {
      // Redirect to signup page instead of showing modal
      navigate("/signup");
    }
    // If user is logged in, do nothing (profile picture is not clickable)
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      if (response.ok) {
        setUser(null);
        setIsDropdownOpen(false);
        navigate("/");
        // Don't reload the page, just update the state
        window.location.reload(); // This will refresh to update the UI
      } else {
        console.error("Logout failed:", response.status);
        // Still try to clear local state even if server logout fails
        setUser(null);
        setIsDropdownOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: clear local state even if request fails
      setUser(null);
      setIsDropdownOpen(false);
      navigate("/");
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.settings-dropdown')) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <SidebarContainer>
      <LogoImage src={Logo} alt="MoonFlower Logo" />
      <SidebarBottom>
        {/* Settings Button with Dropdown - Only show when user is logged in */}
        {user && (
          <div className="settings-dropdown" style={{ position: 'relative' }}>
            <IconButton onClick={handleSettingsClick}>
              <SettingsIconImage src={SettingsIcon} alt="Settings" />
            </IconButton>
            <DropdownMenu isOpen={isDropdownOpen}>
              <DropdownItem onClick={handleLogout}>
                 Logout
              </DropdownItem>
              <DropdownArrow />
            </DropdownMenu>
          </div>
        )}
        
        {/* Profile Button - Only clickable when NOT logged in */}
        {user ? (
          // When logged in: Show non-clickable profile image
          <ProfileImage 
            src={user.photo ? user.photo : ProfileIcon} 
            alt="Profile" 
            isLoggedIn={true}
            onError={e => { e.target.onerror = null; e.target.src = ProfileIcon; }}
          />
        ) : (
          // When not logged in: Show clickable profile button
          <IconButton onClick={handleProfileClick}> 
            <IconImage 
              src={ProfileIcon} 
              alt="Profile" 
              onError={e => { e.target.onerror = null; e.target.src = ProfileIcon; }}
            />
          </IconButton>
        )}
      </SidebarBottom>
    </SidebarContainer>
  );
}

export default Sidebar;
