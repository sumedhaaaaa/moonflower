import React, { useState } from "react";
import styled from "styled-components";


//   width: 200px;
//   height: 280px;
//   background-color: #f897c2;
//   border-radius: 15px;
//   padding: 15px;
//   text-align: center;
//   position: absolute;
//   right: 50px;
//   top: 23%;
//   transform: translateY(-50%);
//   cursor: pointer;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
//   transition: transform 0.2s ease;

//   &:hover {
//     transform: translateY(-50%) scale(1.05);
//   }

//   h3 {
//     font-size: 16px;
//     color: white;
//     margin-bottom: 30px;
//   }

//   img {
//     width: 80px;
//     height: 80px;
//     margin-bottom: 30px;
//   }

//   p {
//     color: white;
//     font-weight: bold;
//     margin-bottom: 15px;
//   }
  
//   @media (max-width: 1024px) {
//     position: relative;
//     right: auto;
//     top: auto;
//     transform: none;
//     margin: 20px auto;
    
//     &:hover {
//       transform: scale(1.05);
//     }
//   }
  
//   @media (max-width: 768px) {
//     width: 180px;
//     height: 250px;
//     padding: 12px;
//     margin: 15px auto;
    
//     h3 {
//       font-size: 14px;
//       margin-bottom: 20px;
//     }
    
//     img {
//       width: 60px;
//       height: 60px;
//       margin-bottom: 20px;
//     }
    
//     p {
//       font-size: 14px;
//       margin-bottom: 10px;
//     }
//   }
  
//   @media (max-width: 480px) {
//     width: 160px;
//     height: 220px;
//     padding: 10px;
//     margin: 10px auto;
    
//     h3 {
//       font-size: 13px;
//       margin-bottom: 15px;
//     }
    
//     img {
//       width: 50px;
//       height: 50px;
//       margin-bottom: 15px;
//     }
    
//     p {
//       font-size: 13px;
//       margin-bottom: 8px;
//     }
//   }
// `;


const FeelingContainer = styled.div`
  width: 200px;
  height: 280px;
  background-color: #f897c2;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  
  /* 👇 Controls the responsive spacing automatically */
  width: 240px;
  height: 280px;
  
  h3 {
    font-size: 30px;   /* ✅ smaller text */
    font-weight: 500;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  p {
    font-size: 13px;
  }

  img {
    width: 70px;
    height: 70px;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 1024px) {
    margin: 4vw auto;
  }

  @media (max-width: 768px) {
    margin: 5vw auto;
  }

  @media (max-width: 480px) {
    margin: 6vw auto;
  }
`;

// Updated PopUpOverlay: using withConfig to filter out the "show" prop
const PopUpOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "show",
})`
  display: ${({ show }) => (show ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const PopUpBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  position: relative;

  h3 {
    font-size: 14px;     /* ✅ smaller text */
  margin-bottom: 8px;
  line-height: 1.2;
  }

  input,
  textarea {
    width: 100%;
    padding: 8px;
    margin: 5px 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  button {
    margin-top: 10px;
    padding: 8px 12px;
    background: #f5a9b8;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background: #f897c2;
    }
  }
  
  @media (max-width: 768px) {
    width: 280px;
    padding: 18px;
    
    h3 {
      font-size: 16px;
      margin-bottom: 8px;
    }
    
    input,
    textarea {
      padding: 10px;
      margin: 4px 0;
      font-size: 16px; /* Prevents zoom on iOS */
    }
    
    button {
      padding: 10px 16px;
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
    padding: 15px;
    
    h3 {
      font-size: 15px;
      margin-bottom: 6px;
    }
    
    input,
    textarea {
      padding: 8px;
      margin: 3px 0;
      font-size: 16px;
    }
    
    button {
      padding: 8px 14px;
      font-size: 13px;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4d4d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #ff3333;
  }
  
  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 13px;
  }
`;

const FeelingBox = () => {
  const [showPopup, setShowPopup] = useState(false);

  // State for input fields
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: ""
  });

  // Open popup and reset fields
  const openPopup = () => {
    setFormData({ name: "", contact: "", message: "" }); // Reset fields
    setShowPopup(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit data
  const handleSubmit = async () => {
    setShowPopup(false); // Close pop-up immediately on click

    try {
      await fetch("http://your-backend-api.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      setFormData({ name: "", contact: "", message: "" }); // Clear input fields
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      {/* Main Feeling Box */}
      <FeelingContainer onClick={openPopup}>
        <h3>How are you feeling today?</h3>
        <img src={require("../assets/heart.png")} alt="Feeling Icon" />
        <p>Share with us!</p>
      </FeelingContainer>

      {/* Pop-up Form */}
      <PopUpOverlay show={showPopup}>
        <PopUpBox>
          <CloseButton onClick={() => setShowPopup(false)}>X</CloseButton>
          <h3>Tell us how you feel</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="contact"
            placeholder="Phone Number / Email"
            value={formData.contact}
            onChange={handleChange}
          />
          <textarea
            rows="3"
            name="message"
            placeholder="Your thoughts..."
            value={formData.message}
            onChange={handleChange}
          ></textarea>
          <button onClick={handleSubmit}>Submit</button>
        </PopUpBox>
      </PopUpOverlay>
    </>
  );
};

export default FeelingBox;
