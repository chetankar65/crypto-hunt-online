import Terminal from "./components/terminal";
import FlagInput from "./components/flagInput";
import CTFPage from "./pages/CTFPage";
import { useState, useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import "./styles.css"

const CTFMainPage = () => {
    const { userDetails } = useContext(AuthContext)
    const [allFlags, setAllFlags] = useState(userDetails.flags); // ideally retrieve from backend
    const [levelComplete, setLevelComplete] = useState(userDetails.levelFinished); // there will be a fixed number of levels anyway

    const handleFlagSuccess = (levelIndex) => {
      const updatedLevels = [...levelComplete];
      updatedLevels[levelIndex] = true; 
      setLevelComplete(updatedLevels);
    };
    
    return (
    <div className="App">
      <div className="logo-container">
        <img src="/logo.svg" alt="CTF Logo" className="logo" />
      </div>
      <div className="body-container">
        <CTFPage />
      </div>
    </div>
    );
};

export default CTFMainPage;
