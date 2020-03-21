import React from 'react';
import logo from './logo.svg';
import './App.css';

import {HomeView} from './home_view'
import {LoginView} from './login_view'
import {RegisterView} from './register_view'


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

function App() {
    return (
        <Router>
        <div className="App">
        <Switch>
            <Route path={"/home"} component={HomeView} />
            <Route path="/sign-up" component={RegisterView} />
            <Route path="/log-in" component={LoginView} />
        </Switch>
        </div>
        </Router>
);
}

export default App;
