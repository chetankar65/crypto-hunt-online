import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({});
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const authenticateWithPassport = async () => {
      try {
        const response = await axios.get(`/noFlags`, {
          withCredentials: true,
          headers: { 'x-access-source': 'crypto-hunt-token' }
        },
          
        );
        setUserDetails(response.data === "" ? null : response.data.user)
        setComplete(true);
      } catch (error) {
        console.error("Error checking Passport.js session:", error);
        setComplete(true);
      }
    };

    authenticateWithPassport();
  }, []);

  return (
    complete && (
      <AuthContext.Provider value={{userDetails, setUserDetails}}>
        {children}
      </AuthContext.Provider>
    )
  );
};

export { AuthContextProvider, AuthContext };