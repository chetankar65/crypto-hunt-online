import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./login.css"
import "../../styles.css"

const LoginWithGoogle = () => {
    const [user, setUser] = useState(null);

    const signin = () => {
        const redirectUri = `/auth/google`;
        window.location.href = redirectUri;
    }
    
    return (
        <div className="landing_page_full">
        <section id="up"></section>
        <section id="down"></section>
        <section id="left"></section>
        <section id="right"></section>
            <div className="login_area">
            <div className="logo-container">
                <img src="/logo.svg" alt="CTF Logo" className="logo" />
            </div>
                <div className="login_button_area">
                    <button className="login_button" onClick={signin}>
                        Sign in with google
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginWithGoogle;