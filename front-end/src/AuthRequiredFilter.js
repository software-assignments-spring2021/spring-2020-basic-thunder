import React, { createContext, useState, useEffect } from "react";
import {LoadingView} from "./loading_view";
import axios from "axios";
import {Switch, Redirect, Route} from "react-router-dom";
const jwtDecode = require('jwt-decode');
const context = createContext(null);

const AuthRequiredFilter = ({ children }) => {
    const [user, setUser] = useState({});
    const [validTokenState,setTokenState] = useState(null);
    // check access-token
    const haveValidToken = () => {
        const token = localStorage.getItem("access-token");
        try {
            const date = new Date(0);
            const decoded = jwtDecode(token);
            date.setUTCSeconds(decoded.exp);
            setTokenState(date.valueOf() > new Date().valueOf());
            if (validTokenState === false) localStorage.removeItem("access-token");
        } catch (e) {
            setTokenState(false);
        }
    };

    useEffect(haveValidToken,[validTokenState]);
    // awaiting access-token validation
    if(validTokenState === null){
        return (<LoadingView />)
    }
    // invalid access-token
    else if (validTokenState === false){
        return <Redirect push to={`/log-in`} />;
    }

    return (
        <context.Provider value={user}>
            <Switch>
                {children}
            </Switch>
        </context.Provider>
    );
};

AuthRequiredFilter.context = context;

export {AuthRequiredFilter};
