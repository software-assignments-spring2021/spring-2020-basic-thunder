import React from 'react';
import logo from './logo.svg';
import './App.css';
import './styles/loggedInHomeView.css'
import './logged_in_home_view'
import {HomeView} from "./logged_in_home_view";
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
                  <Route path="/LoggedInHome/" component={HomeView} />
              </Switch>
          </div>
      </Router>
  );
}

// export default App;
export default App;
