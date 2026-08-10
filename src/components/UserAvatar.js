import React from "react";
import styled from "styled-components";
import ProfileIcon from "../assets/profile.png";

const AvatarImage = styled.img`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  border-radius: 50%;
  object-fit: cover;
`;

function UserAvatar({ photo, alt = "Profile", size = 50, className, style }) {
  return (
    <AvatarImage
      className={className}
      style={style}
      $size={size}
      src={photo || ProfileIcon}
      alt={alt}
      key={photo || "default"}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = ProfileIcon;
      }}
    />
  );
}

export default UserAvatar;
