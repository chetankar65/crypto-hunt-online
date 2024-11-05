import Terminal from "../components/terminal";
import Leaderboard from "../components/Leaderboard";
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./CTFPage.css"

const CTFPage = () => {
    const { userDetails } = useContext(AuthContext)
    
    return (
    <div className="ctf-page">
        <div className="terminal-comp">
            <Terminal />
        </div>
        <div className="leaderboard-comp">
            <Leaderboard />
        </div>
    </div>
    );
};

export default CTFPage;

