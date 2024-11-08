import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import "./flagInput.css"

const FlagInput = ({ flag, level }) => {
  const { userDetails } = useContext(AuthContext);
  const [userInput, setUserInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInput.trim() === flag) {
      try {
        const response = await axios.post(
          '/api/levels/update-level',
          { 
            userId: userDetails._id, 
            level: level
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        // Optionally, handle the response (e.g., show a success message)
        window.location.reload();
      } catch (error) {
        console.error("Error updating level:", error);
      }
    } else {
      toast.error("Incorrect flag!", {
        position: 'top-left',
        duration: 1000,
      });
    }
  };  

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent focus from going back to the terminal
  };

  return (
    <div className="flag-input-container" onClick={handleClick}>
      <form onSubmit={handleSubmit}>
        <label>Enter Flag: </label>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <Toaster />
    </div>
  );
};

export default FlagInput;
