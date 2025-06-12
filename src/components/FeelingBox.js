import React, { useState } from "react";
import styled from "styled-components";

const FeelingContainer = styled.div`
  width: 200px;
  height: 280px;
  background-color: #f897c2;
  border-radius: 15px;
  padding: 15px;
  text-align: center;
  position: absolute;
  right: 50px;
  top: 23%;
  transform: translateY(-50%);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);

  h3 {
    font-size: 16px;
    color: white;
    margin-bottom: 30px;
  }

  img {
    width: 80px;
    height: 80px;
    margin-bottom: 30px;
  }

  p {
    color: white;
    font-weight: bold;
    margin-bottom: 15px;
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
`;

const PopUpBox = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  position: relative;

  h3 {
    margin-bottom: 10px;
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
